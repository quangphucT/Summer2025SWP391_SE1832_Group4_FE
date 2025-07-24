import React, { useEffect, useState } from "react";
import { User2, GraduationCap, Stethoscope, Building2, ClipboardCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeedbackRatingStatisticsByDoctorId } from '../apis/feedbackApi/feedbackApi';

const DoctorCard = ({ doctor, onBook }) => {
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setAvgRating(null);
    getFeedbackRatingStatisticsByDoctorId(doctor.doctorId)
      .then(res => {
        if (isMounted) {
          const avg = res.data?.data?.averageRating;
          setAvgRating(typeof avg === 'number' ? avg : null);
        }
      })
      .catch(() => {
        if (isMounted) setAvgRating(null);
      });
    return () => { isMounted = false; };
  }, [doctor.doctorId]);

  // Render stars based on avgRating (rounded down)
  const renderStars = () => {
    const rating = avgRating !== null ? Math.floor(avgRating) : 5;
    return (
      <>
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <Star key={rating + i} className="w-5 h-5 text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 gap-6 items-start border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Left: Avatar + Button */}
      <div className="flex flex-col items-center md:items-start w-64">
        <Link to={`/doctors/${doctor.doctorId}`}>
          {doctor.profileImageUrl ? (
            <img
              src={doctor.profileImageUrl}
              alt={doctor.fullName}
              className="w-full h-72 object-cover rounded-xl border border-gray-100 mb-4 hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl"
            />
          ) : (
            <div className="w-full h-72 flex items-center justify-center rounded-xl bg-cyan-50 border border-gray-100 mb-4 hover:bg-cyan-100 transition-all duration-300 shadow-md hover:shadow-xl">
              <User2 className="w-16 h-16 text-cyan-500" />
            </div>
          )}
        </Link>
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-lg px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={onBook}
        >
          Book an Appointment
        </button>
      </div>
      {/* Right: Info */}
      <div className="flex-1 flex flex-col justify-start">
        <Link 
          to={`/doctors/${doctor.doctorId}`}
          className="text-xl md:text-2xl font-bold text-[#0072BC] leading-tight mb-2 hover:text-[#005A96] transition-colors"
        >
          {doctor.fullName}
        </Link>
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {renderStars()}
          </div>
          <span className="text-gray-600">{avgRating !== null ? avgRating.toFixed(1) : 5} trên 5</span>
        </div>
        {/* Qualifications */}
        {doctor.qualifications && (
          <div className="flex items-center gap-2 text-gray-700 mb-2 text-base">
            <GraduationCap className="w-5 h-5 text-[#0072BC]" />
            <span>{doctor.qualifications}</span>
          </div>
        )}
        {/* Specialty */}
        {doctor.specialty && (
          <div className="flex items-center gap-2 text-gray-700 mb-2 text-base">
            <Stethoscope className="w-5 h-5 text-[#0072BC]" />
            <span>{doctor.specialty}</span>
          </div>
        )}
        {/* Workplace */}
        {doctor.workplace && (
          <div className="flex items-center gap-2 text-gray-700 mb-2 text-base">
            <Building2 className="w-5 h-5 text-[#0072BC]" />
            <span>{doctor.workplace}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard; 