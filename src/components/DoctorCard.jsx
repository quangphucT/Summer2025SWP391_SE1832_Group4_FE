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

  // Xoá hàm renderStars vì không còn dùng nữa

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center group hover:scale-[1.03] border border-gray-100 mb-6">
      {/* Avatar */}
      <Link to={`/doctors/${doctor.doctorId}`} className="block w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow">
        {doctor.profileImageUrl ? (
          <img src={doctor.profileImageUrl} alt={doctor.fullName} className="w-full h-full object-cover rounded-full" />
        ) : (
          <User2 className="w-12 h-12 text-cyan-500" />
        )}
      </Link>
      {/* Name */}
      <Link 
        to={`/doctors/${doctor.doctorId}`}
        className="text-lg font-bold text-blue-700 mb-1 text-center hover:text-blue-900 transition-colors"
      >
        {doctor.fullName}
      </Link>
      {/* Rating */}
      <div className="flex items-center justify-center mb-2">
        {[...Array(avgRating !== null ? Math.floor(avgRating) : 5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {[...Array(5 - (avgRating !== null ? Math.floor(avgRating) : 5))].map((_, i) => (
          <Star key={100 + i} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-gray-500 text-sm">{avgRating !== null ? avgRating.toFixed(1) : 5} / 5</span>
      </div>
      {/* Degree & Specialty */}
      {doctor.qualifications && (
        <div className="flex items-center text-gray-500 text-sm mb-1">
          <GraduationCap className="w-4 h-4 mr-1" /> {doctor.qualifications}
        </div>
      )}
      {doctor.specialty && (
        <div className="flex items-center text-gray-500 text-sm mb-1">
          <Stethoscope className="w-4 h-4 mr-1" /> {doctor.specialty}
        </div>
      )}
      {doctor.workplace && (
        <div className="flex items-center text-gray-500 text-sm mb-1">
          <Building2 className="w-4 h-4 mr-1" /> {doctor.workplace}
        </div>
      )}
      {/* Book button */}
      <button
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-4"
        onClick={onBook}
      >
        Book an Appointment
      </button>
    </div>
  );
};

export default DoctorCard; 