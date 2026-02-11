import { WebsiteContainer, WebsiteLayout, WebsiteProps } from "@/components/websites";

export function HackWithJack(_props: WebsiteProps) {
    return (
        <WebsiteLayout bg="bg-gray-200">
            <WebsiteContainer className="py-12">
                <div className="text-3xl font-sans flex flex-col items-center">
                    <div className="pb-4">502 Bad Gateway</div>
                    <div className="text-xl">
                        The server returned an invalid or incomplete response.
                    </div>
                    <div className="text-sm">
                        nProxy 0.15.8
                    </div>
                </div>
            </WebsiteContainer>
        </WebsiteLayout>
    )
}