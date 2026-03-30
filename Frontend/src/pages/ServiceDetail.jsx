import { Link, useParams } from 'react-router-dom';
import { SERVICES } from '../data/services';

export default function ServiceDetail() {
  const { slugOrId } = useParams();

  const service =
    SERVICES.find((s) => s.slug === slugOrId) ||
    SERVICES.find((s) => String(s.id) === String(slugOrId)) ||
    null;

  if (!service) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">🧭</div>
            <h1 className="text-2xl font-extrabold text-gray-900">Không tìm thấy dịch vụ</h1>
            <p className="text-gray-600 mt-2">Liên kết không đúng hoặc dịch vụ đã được cập nhật.</p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
            >
              Quay lại trang Dịch vụ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="relative h-[42vh] min-h-[340px] bg-gray-900">
        <img
          src={service.image}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
          <Link to="/services" className="text-white/90 hover:text-white font-bold mb-5 w-fit">
            ← Quay lại
          </Link>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-4xl mb-2">{service.icon}</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{service.name}</h1>
              <p className="mt-4 text-white/90 max-w-2xl text-lg">{service.description}</p>
            </div>
            <Link
              to="/rooms"
              className="bg-amber-400 hover:bg-amber-300 text-gray-900 px-7 py-3.5 rounded-full font-extrabold transition shadow-lg"
            >
              Xem phòng & đặt ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Điểm nổi bật</h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.highlights.map((h) => (
                <li key={h} className="flex gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <span className="text-blue-600 font-black">✓</span>
                  <span className="text-gray-700">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit">
            <h3 className="text-lg font-extrabold text-gray-900">Thông tin</h3>
            <div className="mt-5 space-y-4">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Giờ hoạt động</p>
                <p className="mt-2 font-bold text-gray-900">{service.info.hours}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Vị trí</p>
                <p className="mt-2 font-bold text-gray-900">{service.info.location}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Lưu ý</p>
                <p className="mt-2 font-medium text-gray-800">{service.info.note}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

