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

// Zero-Mock: Dữ liệu khởi tạo rỗng, 100% nạp từ MongoDB Atlas
export const INITIAL_ROOMS = [];

export function createRoomInstance({ id, name, type, price, image, beds, view, size, maxGuests }) {
    return {
        id: String(id).trim(),
        name: name.trim(),
        type,
        price: Number(price) || 0,
        status: ROOM_STATUS.AVAILABLE,
        image: image || '',
        beds: beds || '',
        view: view || '',
        size: size || '',
        maxGuests: Number(maxGuests) || 2,
        currentGuest: null
    };
}
