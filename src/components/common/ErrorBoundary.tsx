import React from 'react';

interface State {
  error: Error | null;
}

// Mencegah layar putih total: tampilkan pesan + tombol pemulihan jika ada error render.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[DesaMudah] Terjadi error:', error, info);
  }

  handleReset = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('desamudah_'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* abaikan */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-lg font-bold text-slate-800">Aplikasi mengalami kendala</h1>
          <p className="text-sm text-slate-500 mt-2">
            Data tersimpan di perangkat ini mungkin rusak. Coba muat ulang, atau reset data lokal.
          </p>
          <p className="text-xs text-slate-400 mt-3 break-words">{this.state.error.message}</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Muat Ulang
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Reset Data & Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }
}
