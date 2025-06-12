

const Symstom = () => {
  return (
    <div>
      {/* HIV Symptoms Section */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="bg-white p-8 rounded-4xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#1e88e5] mb-6 border-b-2 border-[#e0e0e0] pb-3">
            Signs and Symptoms of HIV
          </h2>
          <p className="text-base text-gray-700 mb-4">
            13 common signs and symptoms of HIV. People who have been at risk of
            exposure should get tested for HIV as soon as possible:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <b>Fever</b>: A high fever may occur 2–4 weeks after exposure. It
              often comes with fatigue, muscle aches, and headaches.
            </li>
            <li>
              <b>Swollen lymph nodes</b>: Lymph nodes may become enlarged and
              tender as the immune system responds to the virus.
            </li>
            <li>
              <b>Weight loss</b>: Unexplained weight loss may indicate immune
              system deterioration caused by HIV.
            </li>
            <li>
              <b>Skin rash</b>: A reddish rash, usually not itchy, may develop
              in the early stages of HIV infection.
            </li>
            <li>
              <b>Diarrhea</b>: Persistent diarrhea can occur in early HIV
              infection and may require dietary care and medical attention.
            </li>
            <li>
              <b>Mouth ulcers</b>: Painful sores in the mouth can make eating
              and speaking uncomfortable.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Symstom;
