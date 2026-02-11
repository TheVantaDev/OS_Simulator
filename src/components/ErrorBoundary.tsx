import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-red-500 font-mono p-8">
                    <h2 className="text-2xl font-bold mb-4">System Critical Error</h2>
                    <div className="bg-slate-900 p-4 rounded border border-red-900/50 max-w-2xl overflow-auto">
                        <p className="text-sm">{this.state.error?.message}</p>
                        <pre className="text-xs mt-2 opacity-50">{this.state.error?.stack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Hard Reboot
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
