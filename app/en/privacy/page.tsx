"use client";
import { useTranslations } from "next-intl";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function PrivacyPage() {
    const t = useTranslations("common");

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-6 sm:py-12">
            <Header />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <h1 className="text-3xl font-bold mb-6">{t("footer.privacy")}</h1>

                    <div className="prose">
                        <p className="mb-4">
                            This privacy policy describes how we collect, use, and share your information when you use our Bug Identifier service.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
                        <p className="mb-4">
                            When you use our Bug Identifier service, we collect the images you upload temporarily for analysis purposes.
                            These images are analyzed using Google Vision API and are not permanently stored on our servers.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
                        <p className="mb-4">
                            The images you upload are used solely for the purpose of identifying insect species.
                            We do not use your data for marketing purposes or share it with third parties except as necessary to provide the service.
                        </p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">Data Retention</h2>
                        <p className="mb-4">
                            Images are processed immediately and deleted from our servers after analysis is complete.
                        </p>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}