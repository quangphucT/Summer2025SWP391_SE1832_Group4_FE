import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Typography, Spin } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getPatientRecordsByPatientId } from "../../../apis/patientApi/patentrecordApi";
import { getDoctorById } from "../../../apis/doctorApi/doctorApi";

const { Title } = Typography;

const MedicalRecordMenuPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const user = useSelector((state) => state.user);
  const patientId = user?.patientId || user?.account?.patientId || user?.accountID;

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      setLoading(true);
      try {
        const records = await getPatientRecordsByPatientId(patientId);
        // Lấy tên bác sĩ cho từng record
        const recordsWithDoctorName = await Promise.all(
          (records || []).map(async (rec) => {
            let doctorName = "";
            try {
              if (rec.doctorId) {
                const res = await getDoctorById(rec.doctorId);
                doctorName = res?.data?.fullName || res?.data?.account?.fullName || "";
              }
            } catch {
              doctorName = "";
            }
            return { ...rec, doctorName };
          })
        );
        setData(recordsWithDoctorName);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error loading medical records"
        );
      }
      setLoading(false);
    };
    if (patientId) fetchMedicalRecords();
  }, [patientId]);

  const columns = [
    {
      title: "Record ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Consultation Date",
      dataIndex: "consultationDate",
      key: "consultationDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      key: "symptoms",
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Doctor Notes",
      dataIndex: "doctorNotes",
      key: "doctorNotes",
    },
    {
      title: "Next Steps",
      dataIndex: "nextSteps",
      key: "nextSteps",
    },
    {
      title: "Coinfection Diseases",
      dataIndex: "coinfectionDiseases",
      key: "coinfectionDiseases",
    },
    {
      title: "Drug Allergy History",
      dataIndex: "drugAllergyHistory",
      key: "drugAllergyHistory",
    },
  ];

  return (
    <div
      style={{ backgroundColor: "#e0e7ff", minHeight: "100vh", padding: 24 }}
    >
      {loading ? (
        <Spin
          size="large"
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        />
      ) : (
        <div style={{ background: "#fff", padding: 16, borderRadius: 28 }}>
          <Title
            level={3}
            style={{
              color: "#1e3a8a",
              textAlign: "center",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            Medical Record List
          </Title>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}
    </div>
  );
};

export default MedicalRecordMenuPage;
