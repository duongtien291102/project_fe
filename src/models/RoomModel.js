/**
 * ============================================================================
 * MODEL: RoomModel
 * ============================================================================
 * Định nghĩa thực thể phòng, trạng thái và dữ liệu danh mục phòng nghỉ 5 sao
 */

export const ROOM_STATUS = {
    AVAILABLE: 'Trống',
    OCCUPIED: 'Đang thuê',
    RESERVED: 'Đã đặt',
    CLEANING: 'Đang dọn'
};

export const INITIAL_ROOMS = [
    {
        id: '101',
        name: 'Deluxe King Elegance',
        type: 'Standard',
        price: 750000,
        status: ROOM_STATUS.AVAILABLE,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=700&q=80',
        beds: '1 Giường King lớn',
        view: 'Hướng hoa viên nội khu',
        size: '38m²',
        maxGuests: 2,
        currentGuest: null
    },
    {
        id: '102',
        name: 'Superior Twin Balcony',
        type: 'Superior',
        price: 1100000,
        status: ROOM_STATUS.OCCUPIED,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=700&q=80',
        beds: '2 Giường Twin êm ái',
        view: 'Ban công hướng biển',
        size: '45m²',
        maxGuests: 2,
        currentGuest: 'Trần Hải Đăng'
    },
    {
        id: '201',
        name: 'Executive Suite Hoàng Gia',
        type: 'Suite',
        price: 2200000,
        status: ROOM_STATUS.AVAILABLE,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80',
        beds: 'Giường King Hoàng gia',
        view: 'View đại dương toàn cảnh',
        size: '68m²',
        maxGuests: 3,
        currentGuest: null
    },
    {
        id: '202',
        name: 'Premier Family Suite',
        type: 'Suite',
        price: 2800000,
        status: ROOM_STATUS.RESERVED,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=700&q=80',
        beds: '1 King + 2 Single Bed',
        view: 'Tầng cao hướng vịnh',
        size: '75m²',
        maxGuests: 4,
        currentGuest: 'Lê Minh Khang'
    },
    {
        id: '301',
        name: 'Presidential Ocean Villa',
        type: 'Villa',
        price: 5800000,
        status: ROOM_STATUS.OCCUPIED,
        image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=700&q=80',
        beds: 'Hồ bơi riêng & 2 King Beds',
        view: 'Trực diện bãi biển riêng',
        size: '140m²',
        maxGuests: 6,
        currentGuest: 'David Nguyễn'
    },
    {
        id: '302',
        name: 'Royal Penthouse Skyview',
        type: 'Villa',
        price: 8500000,
        status: ROOM_STATUS.AVAILABLE,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=700&q=80',
        beds: 'Jacuzzi riêng & Phòng rượu VIP',
        view: 'Tầng 25 ngắm 360 độ thành phố',
        size: '210m²',
        maxGuests: 4,
        currentGuest: null
    }
];

export function createRoomInstance({ id, name, type, price, image, beds, view, size, maxGuests }) {
    return {
        id: String(id).trim(),
        name: name.trim(),
        type,
        price: Number(price) || 0,
        status: ROOM_STATUS.AVAILABLE,
        image: image || 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
        beds: beds || 'Giường King Tiêu Chuẩn',
        view: view || 'Hướng biển & Thành phố',
        size: size || '50m²',
        maxGuests: maxGuests || 2,
        currentGuest: null
    };
}
