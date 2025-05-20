"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    position: "relative",
  },
  border: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    bottom: "auto",
    height: 600,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  content: {
    position: "relative",
    height: "100%",
    padding: 10,
  },
  header: {
    position: "relative",
    marginBottom: 25,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  logoContainer: {
    alignSelf: "flex-start",
    marginBottom: 5,
    width: 150,
  },
  logo: {
    width: 150,
    height: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  docNumber: {
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: "row",
    fontSize: 10,
    marginBottom: 2,
  },
  label: {
    width: 120,
  },
  departmentRow: {
    flexDirection: "row",
    fontSize: 10,
    marginBottom: 0,
  },
  smallNote: {
    fontSize: 8,
    marginLeft: 122,
    marginTop: 1,
  },
  table: {
    display: "table" as any,
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 30,
    display: "flex",
    alignItems: "center",
  },
  tableLastRow: {
    flexDirection: "row",
    height: 30,
    display: "flex",
    alignItems: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#4F7942",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    color: "black",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  cellTextLeft: {
    fontSize: 9,
    textAlign: "left",
  },
  cellTextCenter: {
    fontSize: 9,
    textAlign: "center",
  },
  tableHeaderNo: {
    width: "5%",
  },
  tableHeaderNama: {
    width: "30%",
  },
  tableHeaderSpec: {
    width: "25%",
  },
  tableHeaderJumlah: {
    width: "10%",
  },
  tableHeaderSatuan: {
    width: "10%",
  },
  tableHeaderKet: {
    width: "20%",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 8,
    marginTop: 10,
  },
  signatureBox: {
    width: "30%",
  },
  signatureTitle: {
    textAlign: "center",
    marginBottom: 40,
    fontSize: 10,
    height: 14,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginBottom: 3,
  },
  signatureName: {
    textAlign: "center",
    fontSize: 9,
    height: 12,
  },
  signatureLabel: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 2,
    height: 14,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 0,
  },
  footerLeft: {
    fontSize: 8,
  },
  footerRight: {
    fontSize: 8,
  },
  permintaanHeader: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    paddingBottom: 1,
  },
  permintaanSubHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  permintaanSubText: {
    color: "black",
    fontSize: 9,
    textAlign: "center",
  },
  centerText: {
    textAlign: "center",
  },
});

interface FormPermintaanBarangProps {
  data?: {
    username?: string;
    department?: string;
    date?: string;
    procurementItems?: Array<{
      id: number;
      itemName: string;
      specification: string;
      quantity: number;
      unit: string;
      description: string;
    }>;
    note?: string;
    status?: string;
  };
}

interface TableRow {
  no: number | string;
  namaBarang: string;
  spesifikasi: string;
  jumlah: number | string;
  satuan: string;
  keterangan: string;
  isEmpty: boolean;
}

const splitTextIntoWordBoundaryChunks = (
  text: string | undefined | null,
  maxCharsPerRow: number = 30
): string[] => {
  if (!text) return [""];
  text = String(text);

  if (text.length <= maxCharsPerRow) return [text];

  const chunks: string[] = [];
  let currentChunk = "";

  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (word.length > maxCharsPerRow) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      for (let j = 0; j < word.length; j += maxCharsPerRow) {
        if (j + maxCharsPerRow >= word.length) {
          currentChunk = word.substring(j);
        } else {
          chunks.push(word.substring(j, j + maxCharsPerRow));
        }
      }
    } else if ((currentChunk + " " + word).length > maxCharsPerRow) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      if (currentChunk.length > 0) {
        currentChunk += " " + word;
      } else {
        currentChunk = word;
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [""];
};

interface TableCellProps {
  content?: string | number;
  style?: any;
  textAlign?: "left" | "center";
}

const TableCell: React.FC<TableCellProps> = ({
  content,
  style,
  textAlign = "left",
}) => {
  const textStyle =
    textAlign === "center" ? styles.cellTextCenter : styles.cellTextLeft;
  const textContent =
    content !== undefined && content !== null ? String(content) : "";

  return (
    <View style={style}>
      <Text style={textStyle}>{textContent}</Text>
    </View>
  );
};

const FormPermintaanBarang: React.FC<FormPermintaanBarangProps> = ({
  data = {},
}) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join(".");
  };

  const items = data.procurementItems || [];

  const maxCharsPerCell = {
    namaBarang: 35,
    spesifikasi: 30,
    keterangan: 20,
  };

  const generateTableRows = (): TableRow[] => {
    const tableRows: TableRow[] = [];

    let totalRowsUsed = 0;

    for (let i = 0; i < items.length && totalRowsUsed < 9; i++) {
      const item = items[i];

      const hasContent = Boolean(
        item.itemName ||
          item.specification ||
          item.quantity ||
          item.unit ||
          item.description
      );

      if (!hasContent) continue;

      const namaBarangChunks = splitTextIntoWordBoundaryChunks(
        item.itemName,
        maxCharsPerCell.namaBarang
      );
      const spesifikasiChunks = splitTextIntoWordBoundaryChunks(
        item.specification,
        maxCharsPerCell.spesifikasi
      );
      const keteranganChunks = splitTextIntoWordBoundaryChunks(
        item.description,
        maxCharsPerCell.keterangan
      );

      const rowsNeeded = Math.max(
        namaBarangChunks.length,
        spesifikasiChunks.length,
        keteranganChunks.length
      );

      if (totalRowsUsed + rowsNeeded > 9) break;

      tableRows.push({
        no: i + 1,
        namaBarang: namaBarangChunks[0] || "",
        spesifikasi: spesifikasiChunks[0] || "",
        jumlah: item.quantity,
        satuan: item.unit,
        keterangan: keteranganChunks[0] || "",
        isEmpty: false,
      });
      totalRowsUsed++;

      for (let j = 1; j < rowsNeeded && totalRowsUsed < 9; j++) {
        tableRows.push({
          no: "",
          namaBarang: namaBarangChunks[j] || "",
          spesifikasi: spesifikasiChunks[j] || "",
          jumlah: "",
          satuan: "",
          keterangan: keteranganChunks[j] || "",
          isEmpty: false,
        });
        totalRowsUsed++;
      }
    }

    while (tableRows.length < 9) {
      tableRows.push({
        no: "",
        namaBarang: "",
        spesifikasi: "",
        jumlah: "",
        satuan: "",
        keterangan: "",
        isEmpty: true,
      });
    }

    return tableRows;
  };

  const tableRows = generateTableRows();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image src="/KiranaMegantara.png" style={styles.logo} />
            </View>

            <Text style={styles.title}>FORM PERMINTAAN BARANG/JASA</Text>
            <Text style={styles.docNumber}>
              Nomor Dokumen: / V001/NSI/ /2024
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tanggal Dokumen</Text>
              <Text>: {formatDate(data.date)}</Text>
            </View>
            <View style={styles.departmentRow}>
              <Text style={styles.label}>Bagian/Departemen</Text>
              <Text>: Pembelian / Pabrik / Kantor (*)</Text>
            </View>
            <Text style={styles.smallNote}>(*) Coret yang tidak perlu</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={[styles.tableColHeader, styles.tableHeaderNo]}>
                <Text style={styles.centerText}>No.</Text>
              </View>
              <View style={[styles.tableColHeader, styles.tableHeaderNama]}>
                <Text style={styles.centerText}>Nama Barang</Text>
              </View>
              <View style={[styles.tableColHeader, styles.tableHeaderSpec]}>
                <Text style={styles.centerText}>Spesifikasi</Text>
              </View>
              <View
                style={[
                  styles.tableColHeader,
                  { width: "20%", paddingBottom: 0, paddingTop: 4 },
                ]}
              >
                <Text style={[styles.permintaanHeader, styles.centerText]}>
                  Permintaan
                </Text>
                <View style={styles.permintaanSubHeader}>
                  <View
                    style={{
                      width: "50%",
                      borderRightWidth: 1,
                      borderRightColor: "#000",
                      padding: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.permintaanSubText}>Jumlah</Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      padding: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.permintaanSubText}>Satuan</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.tableColHeader, styles.tableHeaderKet]}>
                <Text style={styles.centerText}>Keterangan</Text>
              </View>
            </View>

            {tableRows.map((row, index) => (
              <View
                key={index}
                style={index === 8 ? styles.tableLastRow : styles.tableRow}
                wrap={false}
              >
                <TableCell
                  content={row.no}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderNo,
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="center"
                />

                <TableCell
                  content={row.namaBarang}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderNama,
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="left"
                />

                <TableCell
                  content={row.spesifikasi}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderSpec,
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="left"
                />

                <TableCell
                  content={row.jumlah}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderJumlah,
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="center"
                />

                <TableCell
                  content={row.satuan}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderSatuan,
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="center"
                />

                <TableCell
                  content={row.keterangan}
                  style={[
                    styles.tableCol,
                    styles.tableHeaderKet,
                    { borderRightWidth: 0 },
                    index === 0 ? { paddingTop: 5 } : {},
                  ]}
                  textAlign="left"
                />
              </View>
            ))}
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>Diminta Oleh,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>
                ( {data.username || "                "} )
              </Text>
              <Text style={styles.signatureLabel}>User</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>Disetujui Oleh,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Emorita Kacaribu</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureTitle}>Diketahui Oleh,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Walizar Husyni</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerLeft}>FRM-KM.CRP.05-04.00/1218</Text>
            <Text style={styles.footerRight}>
              Manual - 1 Rangkap : (1) Kasubie GBM ; (2) Procurement; (3) User
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FormPermintaanBarang;
