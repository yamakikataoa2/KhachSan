import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/env';
import { resolveImageUrl } from '../utils/urls';
import roomFallbackImg from '../assets/hero.png';

export default function Home() {
  const [featuredRoomTypes, setFeaturedRoomTypes] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) return;
        const data = await response.json();
        const rooms = Array.isArray(data?.data) ? data.data : [];

        const typeMap = new Map();
        for (const room of rooms) {
          const type = room?.room_type;
          if (!type?.id) continue;

          if (!typeMap.has(type.id)) {
            typeMap.set(type.id, { typeInfo: type, availableRoom: null });
          }
          const entry = typeMap.get(type.id);
          if (!entry.availableRoom && room?.status === 'Available') {
            entry.availableRoom = room;
          }
        }

        const types = Array.from(typeMap.values());
        if (mounted) setFeaturedRoomTypes(types);
      } catch {
        // ignore; UI will show empty state
      } finally {
        if (mounted) setIsLoadingRooms(false);
      }
    };

    fetchFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const topFeatured = useMemo(() => featuredRoomTypes.slice(0, 3), [featuredRoomTypes]);

  return (
    <div className="bg-white text-gray-800">

      {/* 1. SECTION HERO (BANNER LỚN) */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gray-900 text-white">
        {/* Hình nền */}
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop" 
          alt="Khách sạn ABC" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        />
        {/* Nội dung */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Trải Nghiệm Kỳ Nghỉ <span className="text-amber-400">Hoàn Hảo</span> Tại Hotel ABC
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
            Nơi sự sang trọng hòa quyện cùng sự tiện nghi, mang đến cho bạn và gia đình những giây phút thư giãn không thể nào quên.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link to="/rooms" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition duration-300 shadow-lg transform hover:-translate-y-1">
              Khám Phá Phòng
            </Link>
            <Link to="/services" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-full font-bold transition duration-300 shadow-sm">
              Xem Dịch Vụ
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECTION GIỚI THIỆU LỜI CHÀO */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase">Về Chúng Tôi</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 leading-tight">Biểu Tượng Của Sự Sang Trọng & Lòng Hiếu Khách</h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Tọa lạc tại trung tâm thành phố, Hotel ABC tự hào là điểm đến lý tưởng cho cả khách du lịch và thương nhân. Với lịch sử hơn 20 năm, chúng tôi cam kết mang lại dịch vụ vượt trội, không gian được thiết kế tinh tế và ẩm thực độc đáo.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Hãy để chúng tôi chăm sóc từng chi tiết nhỏ nhất trong kỳ nghỉ của bạn.
            </p>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" alt="Lobby khách sạn" className="rounded-lg shadow-2xl z-10 relative"/>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-400 rounded-lg -z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. SECTION PHÒNG NỔI BẬT (FEATURED ROOMS) */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-widest uppercase">Nghỉ Dưỡng</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Các Hạng Phòng Nổi Bật</h2>
            <p className="mt-4 text-lg text-gray-600">Chọn cho mình không gian nghỉ ngơi lý tưởng nhất, từ căn phòng ấm cúng đến các suite sang trọng có tầm nhìn tuyệt đẹp.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingRooms ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-10 bg-gray-200 rounded w-full mt-6" />
                  </div>
                </div>
              ))
            ) : topFeatured.length === 0 ? (
              <div className="md:col-span-3 text-center text-gray-500 py-10 bg-gray-50 rounded-xl border">
                Hiện chưa có phòng để hiển thị. Vui lòng quay lại sau.
              </div>
            ) : (
              topFeatured.map((item) => {
                const type = item.typeInfo;
                const img = resolveImageUrl(type?.image_url || type?.image) || roomFallbackImg;
                const canBook = Boolean(item.availableRoom?.id);

                return (
                  <div key={type.id} className="bg-white rounded-xl shadow-md overflow-hidden border group hover:shadow-2xl transition-all duration-500">
                    <div className="overflow-hidden h-64 bg-gray-200">
                      <img
                        src={img}
                        alt={type.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = roomFallbackImg;
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">{type.name}</h3>
                      <p className="text-gray-600 mt-2 h-12 line-clamp-2">
                        {type.description || 'Trải nghiệm không gian tuyệt vời với đầy đủ tiện nghi tiêu chuẩn.'}
                      </p>
                      <div className="flex justify-between items-center mt-6 border-t pt-4 gap-4">
                        <span className="text-xl font-bold text-orange-600 whitespace-nowrap">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.base_price)}
                          <span className="text-sm text-gray-500 font-normal"> / đêm</span>
                        </span>
                        {canBook ? (
                          <Link
                            to={`/booking/${item.availableRoom.id}`}
                            className="bg-gray-900 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
                          >
                            Đặt Ngay
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
                          >
                            Hết phòng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition shadow-md"
            >
              Xem tất cả phòng <span>→</span>
            </Link>
          </div>
        </div>
      </section>

       {/* 4. SECTION DỊCH VỤ TIỆN ÍCH */}
      <section className="py-20 px-4 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-16">Tiện Nghi & Dịch Vụ Vượt Trội</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                    { icon: "🏊‍♂️", title: "Hồ Bơi Vô Cực", desc: "Tầm nhìn thành phố tuyệt đẹp." },
                    { icon: "🍽️", title: "Nhà Hàng 5 Sao", desc: "Ẩm thực Á - Âu tinh tế." },
                    { icon: "💆‍♀️", title: "Spa & Wellness", desc: "Thư giãn và phục hồi cơ thể." },
                    { icon: "🏋️‍♂️", title: "Phòng Gym 24/7", desc: "Trang thiết bị hiện đại nhất." },
                ].map(svc => (
                    <div key={svc.title} className="bg-blue-600/50 p-8 rounded-xl border border-blue-500 hover:bg-blue-800 transition duration-300">
                        <div className="text-6xl mb-4">{svc.icon}</div>
                        <h3 className="text-xl font-bold mb-1">{svc.title}</h3>
                        <p className="text-blue-100">{svc.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. SECTION ĐÁNH GIÁ (TESTIMONIALS) */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-widest uppercase">Đánh Giá</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Cảm Thấy Của Khách Hàng</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {[
                    {name: "Chị Minh Thư", quote: "Gia đình tôi đã có một kỳ nghỉ tuyệt vời. Phòng VIP Panorama có view đẹp không thể tả, dịch vụ phòng rất nhanh và chu đáo.", avatar: "👩‍💼"},
                    {name: "Anh Hoàng Nam", quote: "Vị trí rất trung tâm, thuận tiện đi lại. Nhân viên lễ tân cực kỳ thân thiện và chuyên nghiệp. Ẩm thực nhà hàng cũng là một điểm cộng lớn.", avatar: "👨‍💻"},
                ].map(review => (
                    <div key={review.name} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex gap-6 items-start hover:shadow-xl transition transition-shadow">
                        <div className="text-5xl">{review.avatar}</div>
                        <div>
                            <div className="text-amber-400 mb-2">★★★★★</div>
                            <p className="text-lg text-gray-700 leading-relaxed italic">"{review.quote}"</p>
                            <p className="mt-4 font-bold text-gray-900 text-lg">- {review.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}