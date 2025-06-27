"use client";

import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CoverLetterPreview = ({ content }) => {
  const [editableContent, setEditableContent] = useState(content);
  const pdfRef = useRef();

  const handleDownload = () => {
    if (!pdfRef.current) return;

    html2pdf()
      .from(pdfRef.current)
      .set({
        margin: 0.5,
        filename: "cover-letter.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Editable Textarea */}
      <Textarea
        className="h-[500px] font-mono bg-white text-black"
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
      />

      {/* PDF Render Area (Hidden) */}
      <div className="hidden">
        <div
          ref={pdfRef}
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "sans-serif",
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "20px",
            color: "#000",
          }}
        >
          {editableContent}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleDownload}>📄 Download PDF</Button>
        <Button onClick={handleCopy}>📋 Copy to Clipboard</Button>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
