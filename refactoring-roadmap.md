# Bug Identifier - Detailed Refactoring Roadmap

This document outlines specific code changes and refactoring steps to implement the simplification plan. Each section provides concrete actions with file paths and code modifications.

## 1. Streamline File Upload Mechanism

### Remove Uploadthing Implementation

Files to remove:
- `app/api/uploadthing/core.ts`
- `app/api/uploadthing/route.ts`

Dependencies to remove from `package.json`:
```json
"@uploadthing/react": "^7.1.5",
"uploadthing": "^7.4.4",
```

### Consolidate Drag-Drop Functionality

Option 1: Remove standalone page if unused:
- Remove `app/drag-drop/page.tsx`

Option 2: If functionality is needed, integrate with main page:
- Move the drag-drop handler code to `app/[locale]/page.tsx`
- Update imports and component structure

## 2. Simplify i18n Approach

### Simplify i18n Configuration

Modify `next-intl.config.ts`:
```typescript
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}/common.json`)).default
}));
```

### Update i18n Implementation Documentation

Update `docs/adr/0001-i18n-implementation.md` to reflect the simpler approach:
```markdown
# 1. Internationalization Strategy

## Status
Accepted (Simplified for POC)

## Context
The application supports English/French with next-intl.

## Decision
Implement a simplified i18n approach appropriate for a POC:

1. Basic multilingual support:
   - Support for English and French
   - JSON-based translation files
   - Simple message formatting

2. Straightforward routing:
   - Locale prefix in URL
   - Default locale fallback

## Consequences
- Simplified translation management
- Reduced complexity in language handling
- Appropriate for POC but would need extension for production
```

### Simplify Locale Provider Structure

Consolidate locale handling in `app/[locale]/layout.tsx`:
```typescript
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { locales } from '../../middleware';
import LocaleProvider from './LocaleProvider';

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
    children: ReactNode;
    params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = params;

    if (!locales.includes(locale as any)) {
        notFound();
    }

    let messages;
    try {
        messages = (await import(`../../messages/${locale}/common.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <LocaleProvider locale={locale} messages={messages}>
            <div className={inter.className}>
                {children}
            </div>
        </LocaleProvider>
    );
}
```

## 3. Rationalize Project Structure

### Consolidate Layouts

Simplify `app/layout.tsx`:
```typescript
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bug Identifier - Professional Pest Control Solutions',
  description: 'Upload a photo of any insect or pest for instant identification and get professional pest control recommendations.',
  // Remaining metadata...
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Reorganize Components

Create a consistent components structure:
```
/app
  /components
    /ui
      DropZone.tsx (extracted from page.tsx)
      AnalysisResult.tsx (extracted from page.tsx)
    /layout
      Header.tsx
      Footer.tsx
  /hooks
    useImageAnalysis.ts (moved from [locale]/hooks)
```

## 4. Refactor API Implementation

### Create Dedicated Services

Create service files:
```
/app/services
  /vision
    visionService.ts
  /translation
    translationService.ts
```

Example `visionService.ts`:
```typescript
import axios from "axios";

export interface VisionAnalysisResult {
  labels: any[];
  webEntities: any[];
}

export async function analyzeImage(imageBase64: string, language: string): Promise<VisionAnalysisResult> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Google API key missing");
  }

  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
    {
      requests: [
        {
          image: { content: imageBase64 },
          features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "WEB_DETECTION", maxResults: 20 }
          ],
          imageContext: {
            languageHints: [language]
          }
        }
      ]
    }
  );

  const labels = response.data.responses[0]?.labelAnnotations || [];
  const webEntities = response.data.responses[0]?.webDetection?.webEntities || [];

  return { labels, webEntities };
}

export function filterInsectLabels(labels: any[], webEntities: any[]): any[] {
  return [...labels, ...webEntities].filter((label: any) => {
    const description = label.description.toLowerCase();
    if (["insect", "bug", "pest"].includes(description)) {
      return false;
    }
    return (
      description.includes('beetle') ||
      description.includes('ant') ||
      description.includes('spider') ||
      description.includes('roach') ||
      description.includes('wasp') ||
      description.includes('bee') ||
      description.includes('moth') ||
      description.includes('fly') ||
      description.includes('cricket') ||
      description.includes('termite') ||
      description.includes('tick')
    );
  });
}
```

### Simplify API Route

Refactor `app/api/analyze/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { analyzeImage, filterInsectLabels } from "../../services/vision/visionService";
import { translateText } from "../../services/translation/translationService";

export async function POST(request: Request) {
  const acceptLanguage = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
  const language = acceptLanguage.split('-')[0];

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageBase64 = buffer.toString('base64');

    // Analyze the image
    const { labels, webEntities } = await analyzeImage(imageBase64, language);
    
    // Filter for insect labels
    const insectLabels = filterInsectLabels(labels, webEntities);

    if (insectLabels.length === 0) {
      return NextResponse.json({
        identifiedAs: null,
        errorMessage: "No insect species detected in the image. Please upload a clear image of an insect."
      });
    }

    // Sort by confidence and get best match
    const bestMatch = insectLabels.sort(
      (a: any, b: any) => (b.score || b.confidence) - (a.score || a.confidence)
    )[0];

    const confidence = Math.min(Math.max(bestMatch.score || bestMatch.confidence || 0, 0), 1);
    const originalDescription = bestMatch.description;
    
    // Translate if needed
    let localizedDescription = originalDescription;
    if (language !== "en") {
      try {
        localizedDescription = await translateText(originalDescription, language);
      } catch (err) {
        console.error("Translation error:", err);
      }
    }

    return NextResponse.json({
      identifiedAs: localizedDescription,
      confidence: confidence,
      redirectUrl: `${
        process.env.BUSINESS_URL || "https://example.com"
      }/devis-et-prix?species=${encodeURIComponent(originalDescription)}`,
      imageData: `data:${file.type};base64,${imageBase64}`
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
```

## 5. Remove Unused Features

### Clean up Theme Implementation

If theme functionality is minimal:
- Consider removing `src/theme/ThemeProvider.tsx` and related files
- Update `app/layout.tsx` to remove theme provider

Or simplify to a basic implementation only if needed.

### Simplify Legal Content

If legal content is needed:
- Consolidate to a single directory
- Simplify routing and access

If not needed for POC:
- Remove `content/legal` directory

## Implementation Strategy

### Phase 1: Core Structure and Upload Mechanism

1. Remove uploadthing implementation and dependencies
2. Address the duplicate drag-drop page
3. Consolidate layouts and simplify structure

### Phase 2: API Refactoring

1. Create service modules for vision and translation
2. Refactor the analyze API route
3. Update client-side code to match API changes

### Phase 3: i18n Simplification

1. Update i18n configuration 
2. Simplify locale handling
3. Update documentation

### Phase 4: Clean-up and Documentation

1. Remove unused features and dependencies
2. Update project documentation
3. Test all functionality