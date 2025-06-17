import { useEffect, useState } from 'react'
import './index.scss'
import { toast } from 'react-toastify'
import { getAllAppointmentsToday } from '../../../../apis/appointmentAPI/getAllAppointmentsTodayApi'
import { Table } from 'antd'
const AppointmentTodayManagement = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchingData = async() => {
    setLoading(true)
    try {
      const response = await getAllAppointmentsToday();
      setData(response.data.data)
    } catch (error) {
      toast.error(error?.response?.data?.message?.error || "Error while fetching data")
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchingData();
  },[])
const columns = [
  {
    title: 'Patient Information',
    children: [
      {
        title: 'Patient Name',
        dataIndex: 'patientName',
        key: 'patientName',
      },
      {
        title: 'Patient Code',
        dataIndex: ['patient', 'patientCodeAtFacility'],
        key: 'patientCode',
      },
      {
        title: 'Phone Number',
        dataIndex: ['patient', 'account', 'phoneNumber'],
        key: 'phoneNumber',
      },
    ],
  },
  {
    title: 'Appointment Details',
    children: [
      {
        title: 'Date',
        dataIndex: 'appointmentDate',
        key: 'appointmentDate',
      },
      {
        title: 'Time',
        dataIndex: 'appointmentTime',
        key: 'appointmentTime',
      },
      {
        title: 'Type',
        dataIndex: 'appointmentType',
        key: 'appointmentType',
      },
      {
        title: 'Service',
        dataIndex: 'appointmentService',
        key: 'appointmentService',
      },
    ],
  },
  {
    title: 'Doctor',
    dataIndex: ['doctor', 'account', 'fullName'],
    key: 'doctorName',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let color = 'blue';
      if (text === 'Scheduled') color = 'green';
      if (text === 'Cancelled') color = 'red';
      return <span style={{ color }}>{text}</span>;
    },
  },
];



    return (
  <div>
    <h2 className="font-bold text-[30px] mb-3 text-[#1976d2]">Today's Appointments</h2>
    <Table
      loading={loading}
      columns={columns}
      dataSource={data}
      rowKey="appointmentId"
      bordered
    />
  </div>
)

  
}

export default AppointmentTodayManagement
