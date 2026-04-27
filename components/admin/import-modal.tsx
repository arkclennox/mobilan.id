'use client';

import { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ParsedRow = Record<string, unknown>;

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columnMap: Record<string, string>;   // csv header (lowercase) → db field
  previewFields: { key: string; label: string }[]; // which db fields to show in preview
  importEndpoint: string;
  onSuccess: () => void;
}

async function parseFile(file: File, columnMap: Record<string, string>): Promise<{ rows: ParsedRow[]; unmapped: string[] }> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  let rawRows: Record<string, string>[] = [];

  if (ext === 'csv') {
    const Papa = (await import('papaparse')).default;
    const text = await file.text();
    const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    rawRows = result.data;
  } else {
    const XLSX = await import('xlsx');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const arr = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });
    rawRows = arr;
  }

  const unmappedSet = new Set<string>();
  const rows: ParsedRow[] = rawRows.map(raw => {
    const mapped: ParsedRow = {};
    for (const [header, value] of Object.entries(raw)) {
      const norm = header.trim().toLowerCase().replace(/\s+/g, '_');
      const dbField = columnMap[norm] || columnMap[header.trim().toLowerCase()];
      if (dbField) {
        mapped[dbField] = value;
      } else if (header.trim()) {
        unmappedSet.add(header.trim());
      }
    }
    return mapped;
  });

  return { rows, unmapped: Array.from(unmappedSet) };
}

export function ImportModal({ isOpen, onClose, title, columnMap, previewFields, importEndpoint, onSuccess }: ImportModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [unmapped, setUnmapped] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ inserted: number; errors: { row: number; error: string }[] } | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setParsing(true);
    setResult(null);
    setRows([]);
    setFileName(file.name);
    try {
      const { rows: parsed, unmapped: um } = await parseFile(file, columnMap);
      setRows(parsed);
      setUnmapped(um);
    } catch {
      alert('Gagal membaca file. Pastikan format CSV atau XLSX valid.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch(importEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setResult(json);
      if (json.inserted > 0) onSuccess();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal mengimpor');
    } finally {
      setImporting(false);
    }
  };

  const reset = () => { setRows([]); setUnmapped([]); setFileName(''); setResult(null); };

  const close = () => { reset(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <button onClick={close} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* File drop zone */}
          {!rows.length && !parsing && !result && (
            <div
              className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">Klik atau drop file di sini</p>
              <p className="text-sm text-muted-foreground">Format: .csv, .xlsx, .xls</p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          )}

          {parsing && <p className="text-center text-muted-foreground py-8">Membaca file...</p>}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">{result.inserted} baris berhasil diimpor</p>
                  {result.errors.length > 0 && (
                    <p className="text-sm text-green-700">{result.errors.length} baris gagal (lihat di bawah)</p>
                  )}
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="bg-red-50 rounded-lg border border-red-200 p-4 max-h-40 overflow-y-auto">
                  {result.errors.slice(0, 20).map((e, i) => (
                    <p key={i} className="text-xs text-red-700">Baris {e.row}: {e.error}</p>
                  ))}
                </div>
              )}
              <Button variant="outline" onClick={reset} className="w-full">Import File Lain</Button>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && !result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-muted-foreground">{rows.length} baris terdeteksi</p>
                </div>
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground underline">Ganti file</button>
              </div>

              {unmapped.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-800">
                    Kolom tidak dikenali (diabaikan): <span className="font-mono">{unmapped.join(', ')}</span>
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Preview (5 baris pertama)</p>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                        {previewFields.map(f => (
                          <th key={f.key} className="px-3 py-2 text-left font-medium text-muted-foreground">{f.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 text-muted-foreground">{i + 2}</td>
                          {previewFields.map(f => (
                            <td key={f.key} className="px-3 py-1.5 max-w-[150px] truncate">
                              {String(row[f.key] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {rows.length > 0 && !result && (
          <div className="p-5 border-t border-border flex justify-end gap-3">
            <Button variant="outline" onClick={close}>Batal</Button>
            <Button
              onClick={handleImport}
              disabled={importing}
              className="bg-brand-600 hover:bg-brand-700"
            >
              {importing ? 'Mengimpor...' : `Import ${rows.length} baris`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
