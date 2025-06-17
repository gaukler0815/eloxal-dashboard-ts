import React, { useEffect, useState } from "react";
import '../styles/globals.css';

interface Prognose {
  datum: string;
  schwefelsaeure: string;
  natronlauge: string;
  aluminium: string;
  aluminiumpreis: number;
  trend: string;
  nachfrage_deutschland: string;
  ereignisse: string[];
}

const AmpelBox = ({ titel, status }: { titel: string; status: string }) => {
  let farbe = "bg-gray-300";
  if (status.toLowerCase().includes("engpass")) farbe = "bg-red-500";
  else if (status.toLowerCase().includes("möglich")) farbe = "bg-yellow-400";
  else if (status.toLowerCase().includes("verfügbar")) farbe = "bg-green-500";

  return (
    <div className="rounded-xl p-4 text-white shadow-md text-center">
      <div className="text-lg font-semibold mb-2">{titel}</div>
      <div className={`text-xl font-bold rounded px-3 py-2 ${farbe}`}>{status}</div>
      <div className="text-sm text-white/80 mt-1">Prognose (3 Monate)</div>
    </div>
  );
};

const Dashboard = () => {
  const [daten, setDaten] = useState<Prognose | null>(null);

  useEffect(() => {
    fetch("https://eloxal-backend.onrender.com/api/prognose")
      .then((res) => res.json())
      .then((data) => setDaten(data))
      .catch((err) => console.error("Fehler beim Laden der Prognose:", err));
  }, []);

  if (!daten) return <div className="p-6">Lade Prognose...</div>;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800">Resilienz-Analyse Eloxal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AmpelBox titel="Schwefelsäure" status={daten.schwefelsaeure} />
        <AmpelBox titel="Natronlauge" status={daten.natronlauge} />
        <AmpelBox titel="Aluminium" status={daten.aluminium} />
      </div>

      <div className="rounded-xl bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Aluminium-Markt</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📦 Preis: <strong>{daten.aluminiumpreis} €/t</strong></li>
          <li>📈 Trend: <strong>{daten.trend}</strong></li>
          <li>🚚 Beschaffung & Sanktionen: <strong>Keine Probleme</strong></li>
          <li>🛒 Einkaufszahlen in Deutschland: <strong>{daten.nachfrage_deutschland}</strong></li>
        </ul>
      </div>

      <div className="rounded-xl bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Aktuelle Ereignisse</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {daten.ereignisse.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
