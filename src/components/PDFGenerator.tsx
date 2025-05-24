"use client";

import React from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import FormPermintaanBarang from "./FormPermintaanBarang";

interface PDFGeneratorProps {
  data: any;
  filename?: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  data,
  filename = "form-permintaan-barang.pdf",
}) => {
  const generatePDF = async () => {
    const blob = await pdf(<FormPermintaanBarang data={data} />).toBlob();
    saveAs(blob, filename);
  };

  return (
    <button
      onClick={generatePDF}
      className="rounded-md px-4 py-2 font-medium text-sm flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Generate PDF
    </button>
  );
};

export default PDFGenerator;
