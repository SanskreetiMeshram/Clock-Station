import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clock Station caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#8EDBFF] flex items-center justify-center p-6 text-center select-none font-display">
          <div className="bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-8 max-w-md flex flex-col items-center">
            <span className="text-6xl mb-4">🚂💨</span>
            <h1 className="text-3xl font-black text-[#1B2A49] mb-2">
              Oops! The Train Stopped!
            </h1>
            <p className="text-base text-slate-600 font-bold mb-6">
              Don't worry! Let's get our train back on the tracks.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 rounded-2xl bg-[#3DDC84] text-[#1B2A49] font-black text-xl border-3 border-[#1B2A49] shadow-chunky flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restart Station</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
