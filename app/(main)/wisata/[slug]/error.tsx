'use client';

export default function WisataError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground mb-4">Gagal memuat halaman wisata.</p>
        {error.message && (
          <pre className="text-xs bg-muted rounded p-3 text-left overflow-auto mb-4">
            {error.message}
          </pre>
        )}
        {error.digest && (
          <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
