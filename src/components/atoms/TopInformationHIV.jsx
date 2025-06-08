import { Card } from "antd";
import { HeartTwoTone, CalendarOutlined, MedicineBoxOutlined } from "@ant-design/icons";

const HIVTreatmentInfoCard = () => {
  return (
    <Card
      title={
        <span className="text-lg font-semibold text-[#1e88e5]">
          <MedicineBoxOutlined className="mr-2" />
          HIV Treatment Info
        </span>
      }
      className="mt-10 shadow-xl rounded-2xl"
    >
      <div className="space-y-2 text-gray-700">
        <p>
          <HeartTwoTone twoToneColor="#eb2f96" className="mr-2" />
          <strong>Current Medication:</strong> Tenofovir + Emtricitabine + Dolutegravir
        </p>
        <p>
          <CalendarOutlined className="mr-2 text-blue-500" />
          <strong>Next Check-up:</strong> June 20, 2025
        </p>
        <p>
          Maintaining regular medication helps keep your viral load undetectable and your health stable.
        </p>
      </div>
    </Card>
  );
};

export default HIVTreatmentInfoCard;
