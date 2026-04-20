# Huong dan nguoi dung doanh nghiep/doi tac

Tai lieu nay danh cho nguoi dung thuoc nhom doanh nghiep, hop tac xa, to chuc, nha cung cap dich vu, don vi nghien cuu/tu van, va cac doi tac muon tham gia mang luoi cua Good Practices Platform.

## 1. Pham vi va muc tieu

Nhom doanh nghiep/doi tac co the su dung nen tang de:

- Tao tai khoan doanh nghiep.
- Cap nhat thong tin to chuc va thong tin lien he.
- Tao va gui ho so doanh nghiep de duoc admin xem xet.
- Xuat hien trong danh sach doi tac cong khai sau khi duoc duyet.
- Truy cap thu vien tai lieu, su kien, chinh sach, bao cao va cac thuc hanh tot.
- Ket noi voi mang luoi doi tac ve nong nghiep ben vung, chuoi gia tri lua va tom.

Luu y: tai khoan doanh nghiep khac voi tai khoan ca nhan. Tai khoan doanh nghiep co them luong ho so doanh nghiep/doi tac va co the duoc admin dua vao danh sach doi tac hien thi tren nen tang.

## 2. Cac vai tro lien quan

### 2.1 Tai khoan doanh nghiep (`BUSINESS`)

Tai khoan doanh nghiep la tai khoan cua mot to chuc hoac doanh nghiep. Tai khoan nay co the:

- Dang nhap vao nen tang.
- Cap nhat thong tin tai khoan co ban.
- Tao ho so doanh nghiep tai trang `/business/profile`.
- Tai logo doanh nghiep.
- Gui ho so cho admin duyet.

Tai khoan doanh nghiep khong mac dinh co quyen vao khu vuc admin.

### 2.2 Ho so doi tac (`BusinessProfile`)

Ho so doi tac la ban ghi cong khai hoac noi bo ve doanh nghiep tren nen tang. Mot ho so doi tac gom:

- Ten doanh nghiep.
- Slug dinh danh.
- Logo.
- Website.
- Email lien he.
- So dien thoai.
- Tinh/thanh pho.
- Mo ta doanh nghiep.
- Trang thai duyet.
- Co cong khai hay khong.
- Co duoc xac minh hay khong.
- Thu tu hien thi.

Ho so doi tac chi hien thi cong khai khi admin cau hinh phu hop, thuong la da duyet, cong khai va co thu tu hien thi hop le.

### 2.3 Quan tri vien (`ADMIN`)

Admin quan ly nguoi dung va ho so doi tac. Admin co the:

- Tao tai khoan doanh nghiep.
- Chuyen tai khoan doanh nghiep thanh doi tac.
- Tao ho so doi tac ngay khi tao tai khoan doanh nghiep.
- Sua thong tin ho so doi tac.
- Duyet, tu choi, tam ngung ho so.
- Bat/tat trang thai cong khai.
- Danh dau da xac minh.
- Sap xep thu tu hien thi logo doi tac.
- Cau hinh so luong logo doi tac hien thi tren trang chu.

## 3. Luong su dung tong quan

Luong tieu chuan cho mot doanh nghiep moi:

1. Truy cap trang tham gia mang luoi doi tac: `/join-us`.
2. Chon dang ky tai khoan doanh nghiep.
3. Tao tai khoan tai `/auth/signup?role=business`.
4. Dang nhap tai `/auth/signin`.
5. Mo trang ho so doanh nghiep: `/business/profile?init=1`.
6. Dien thong tin doanh nghiep va upload logo.
7. Bam `Luu ho so`.
8. Bam `Gui duyet`.
9. Cho admin xem xet.
10. Sau khi duoc duyet va cong khai, logo/thong tin doi tac co the xuat hien tren trang doi tac va/hoac trang chu.

Voi ngon ngu tieng Viet, co the dung duong dan co tien to `/vi`, vi du:

- `/vi/join-us`
- `/vi/auth/signup?role=business`
- `/vi/auth/signin`
- `/vi/business/profile?init=1`
- `/vi/partners`

Voi ngon ngu tieng Anh, dung tien to `/en`.

## 4. Dang ky tai khoan doanh nghiep

### 4.1 Tu trang tham gia doi tac

Nguoi dung mo trang `/join-us`. Trang nay gioi thieu mang luoi doi tac va co nut dang ky.

Neu chua dang nhap, nut dang ky se dua nguoi dung den:

```text
/auth/signup?role=business
```

Neu da dang nhap bang tai khoan doanh nghiep, nut nay se dua den:

```text
/business/profile?init=1
```

### 4.2 Chon loai tai khoan

Tai trang dang ky, chon loai tai khoan `Doanh nghiep`. Neu truy cap bang duong dan co `?role=business`, he thong se tu dong chon loai tai khoan doanh nghiep.

### 4.3 Thong tin can nhap

Nguoi dung doanh nghiep can nhap:

- Ten doanh nghiep.
- Email.
- So dien thoai.
- Tinh/thanh pho.
- Linh vuc kinh doanh.
- Mat khau.
- Xac nhan mat khau.

Trong do:

- Email la dinh danh dang nhap va phai duy nhat.
- So dien thoai neu nhap thi phai duy nhat.
- Linh vuc kinh doanh la bat buoc voi tai khoan doanh nghiep.
- Mat khau va xac nhan mat khau phai trung nhau.

### 4.4 Sau khi dang ky thanh cong

Sau khi tao tai khoan doanh nghiep thanh cong, he thong hien thi loi moi hoan thien ho so doanh nghiep. Nguoi dung chon `Hoan thien ho so doanh nghiep`, dang nhap neu can, roi tiep tuc tai trang ho so.

## 5. Dang nhap va dieu huong sau dang nhap

Nguoi dung dang nhap tai:

```text
/auth/signin
```

Sau khi dang nhap:

- Admin va Moderator duoc dieu huong vao `/admin`.
- Tai khoan doanh nghiep va tai khoan ca nhan duoc dieu huong ve trang chu hoac duong dan callback neu co.

Neu dang nhap tu loi moi hoan thien ho so doanh nghiep, callback thuong la:

```text
/business/profile?init=1
```

## 6. Hoan thien ho so doanh nghiep

Trang ho so doanh nghiep:

```text
/business/profile
```

Hoac khoi tao ho so lan dau:

```text
/business/profile?init=1
```

Chi tai khoan co vai tro `BUSINESS` moi truy cap duoc trang nay. Tai khoan khong phai doanh nghiep se bi chuyen ve trang chu.

### 6.1 Cac truong trong ho so

Ho so doanh nghiep gom:

- `Ten doanh nghiep`: bat buoc.
- `Logo doanh nghiep`: upload file anh.
- `Website`: tuy chon.
- `Email lien he`: tuy chon, nen dung email chinh thuc cua to chuc.
- `So dien thoai`: tuy chon.
- `Tinh/Thanh pho`: tuy chon.
- `Mo ta`: tuy chon, nen viet ngan gon ve linh vuc hoat dong, nang luc, san pham/dich vu va lien quan toi nong nghiep ben vung.

### 6.2 Upload logo

Tai muc `Logo doanh nghiep`, chon `Upload logo` va tai len file anh.

Khuyen nghi:

- Dung logo ro net, nen trong suot hoac nen sang.
- Ty le vuong hoac gan vuong de hien thi tot trong o logo.
- Khong dung anh qua nho, mo, co nhieu chu nho kho doc.
- Khong upload file khong phai hinh anh.

### 6.3 Luu ho so

Sau khi nhap thong tin, bam `Luu ho so`. Viec luu ho so chi ghi nhan ban nhap hien tai; chua dong nghia voi viec ho so da duoc gui duyet hoac hien thi cong khai.

### 6.4 Gui duyet

Sau khi da luu thong tin can thiet, bam `Gui duyet`.

Dieu kien toi thieu:

- Ho so doanh nghiep ton tai.
- Co ten doanh nghiep.

Sau khi gui duyet, trang thai ho so chuyen sang `Dang cho duyet` (`PENDING`). Trong trang thai nay, nut gui duyet se bi vo hieu hoa cho den khi admin xu ly.

## 7. Trang thai ho so doi tac

Ho so doi tac co cac trang thai sau:

- `DRAFT` / `Ban nhap`: Ho so moi tao hoac dang chinh sua, chua gui duyet.
- `PENDING` / `Dang cho duyet`: Da gui cho admin xem xet.
- `APPROVED` / `Da duyet`: Admin da chap thuan ho so.
- `REJECTED` / `Bi tu choi`: Admin tu choi ho so, thuong can chinh sua theo ghi chu.
- `SUSPENDED` / `Tam ngung`: Ho so bi tam ngung hien thi hoac tam ngung trang thai doi tac.

Neu admin nhap ghi chu duyet, nguoi dung doanh nghiep co the thay ghi chu nay trong trang ho so doanh nghiep.

## 8. Khi nao ho so duoc hien thi cong khai

Mot ho so khong tu dong hien thi cong khai chi vi nguoi dung da bam `Gui duyet`.

Admin can xem xet va cau hinh cac yeu to sau:

- Trang thai ho so.
- Co cong khai (`isPublic`) hay khong.
- Co xac minh (`isVerified`) hay khong.
- Thu tu hien thi (`displayOrder`).
- So luong logo doi tac duoc hien thi tren trang chu.

Quy uoc hien thi trong khu vuc admin:

- `displayOrder >= 0`: co the hien thi logo tren nen tang.
- `displayOrder < 0`: an logo khoi khu vuc hien thi.

Trang doi tac cong khai lay danh sach doi tac tu API cong khai. Trang chu co the chi hien thi mot so luong logo nhat dinh theo cau hinh cua admin.

## 9. Huong dan viet mo ta doanh nghiep

Mo ta nen ngan gon, ro rang va tap trung vao gia tri hop tac. Goi y cau truc:

```text
[Ten doanh nghiep/to chuc] hoat dong trong linh vuc [linh vuc].
Don vi co kinh nghiem ve [nang luc/san pham/dich vu chinh].
Trong mang luoi doi tac, don vi mong muon dong gop vao [muc tieu lien quan toi nong nghiep ben vung, ESG, chuoi gia tri, ho tro nong dan/doanh nghiep].
```

Vi du:

```text
Cong ty ABC hoat dong trong linh vuc giai phap nong nghiep thong minh cho chuoi gia tri lua. Don vi cung cap dich vu tu van ky thuat, giam sat canh tac va ket noi thi truong cho hop tac xa. ABC mong muon hop tac voi cac doi tac tren nen tang de thuc day san xuat ben vung, giam phat thai va nang cao nang luc cho nong dan.
```

Nen tranh:

- Noi dung qua dai hoac mang tinh quang cao chung chung.
- Thong tin khong lien quan den hop tac, nong nghiep, ESG, chuoi gia tri hoac phat trien ben vung.
- So dien thoai/email ca nhan neu khong phai kenh lien he chinh thuc.
- Tuyen bo chua duoc kiem chung ve chung nhan, giai thuong, nang luc.

## 10. Cap nhat thong tin tai khoan

Nguoi dung co the cap nhat thong tin tai khoan ca nhan/to chuc tai:

```text
/account
```

Cac truong co the cap nhat:

- Ho ten/ten hien thi.
- So dien thoai.
- Tinh/thanh pho.
- To chuc.
- Mat khau.

Luu y: thong tin tai khoan va thong tin ho so doi tac la hai nhom du lieu khac nhau. Neu muon thay doi noi dung hien thi trong danh sach doi tac, hay cap nhat tai `/business/profile`, khong chi cap nhat tai `/account`.

## 11. Khu vuc doi tac cong khai

Nguoi truy cap co the xem doi tac tai:

```text
/partners
```

Va trang tham gia mang luoi tai:

```text
/join-us
```

Trang `/join-us` co the hien thi logo doi tac da cau hinh. Neu chua co du lieu doi tac tu he thong, trang co the dung danh sach logo mac dinh/fallback.

## 12. Huong dan cho admin quan ly doi tac

### 12.1 Tao tai khoan doanh nghiep

Admin vao:

```text
/admin/users
```

Tai day admin co the tao tai khoan moi va chon vai tro `Business`.

Khi tao tai khoan doanh nghiep:

- Truong `To chuc / linh vuc kinh doanh` la bat buoc.
- Admin co the chon tao ho so doi tac ngay.
- Neu tao ho so doi tac ngay, can co ten doanh nghiep.

### 12.2 Chuyen tai khoan doanh nghiep thanh doi tac

Trong trang quan ly nguoi dung, voi tai khoan co vai tro `BUSINESS`, admin co the chon thao tac `Len doi tac`.

Admin can nhap/cap nhat:

- Ten doanh nghiep.
- Email lien he.
- Tinh/thanh.
- Thu tu hien thi.
- Logo neu co.

Neu nguoi dung da co ho so doi tac, nut thao tac se the hien trang thai da la doi tac.

### 12.3 Quan ly danh sach doi tac

Admin vao:

```text
/admin/partners
```

Tai day admin co the:

- Tim doi tac theo ten cong ty, slug, email.
- Upload logo.
- Sua thong tin doi tac.
- Cap nhat thu tu hien thi.
- Xoa ho so doi tac.
- Cau hinh so luong logo doi tac hien thi tren trang chu.

### 12.4 Sua thong tin doi tac

Khi bam `Sua`, admin co the chinh:

- Ten doanh nghiep.
- Email.
- Dien thoai.
- Website.
- Tinh/thanh.
- Mo ta.
- Ghi chu duyet.
- Thu tu hien thi.
- Trang thai.
- Da xac minh.
- Cong khai.

Neu muon doi tac hien thi cong khai, admin can dam bao ho so duoc dat trang thai phu hop, bat `Cong khai`, va cau hinh thu tu hien thi khong am neu can hien logo.

### 12.5 Ghi chu duyet

Ghi chu duyet nen ngan gon va hanh dong duoc. Vi du:

- "Vui long bo sung website chinh thuc."
- "Logo bi mo, vui long upload file chat luong cao hon."
- "Mo ta can neu ro vai tro cua doanh nghiep trong chuoi gia tri lua/tom."

Ghi chu nay giup doanh nghiep biet can sua gi khi ho so bi tu choi hoac can bo sung.

## 13. Tinh huong thuong gap

### 13.1 Khong vao duoc trang ho so doanh nghiep

Nguyen nhan co the:

- Chua dang nhap.
- Dang nhap bang tai khoan ca nhan thay vi tai khoan doanh nghiep.
- Tai khoan chua duoc gan vai tro `BUSINESS`.

Cach xu ly:

- Dang nhap lai tai `/auth/signin`.
- Kiem tra tai khoan da chon loai `Doanh nghiep` khi dang ky.
- Lien he admin neu can doi vai tro tai khoan.

### 13.2 Khong gui duyet duoc

Nguyen nhan co the:

- Chua co ho so doanh nghiep.
- Chua nhap ten doanh nghiep.
- Ho so dang o trang thai `PENDING` hoac `APPROVED`.

Cach xu ly:

- Mo `/business/profile?init=1` de khoi tao ho so neu chua co.
- Nhap ten doanh nghiep va bam `Luu ho so`.
- Sau do bam `Gui duyet`.

### 13.3 Da duoc duyet nhung chua thay logo tren trang chu

Nguyen nhan co the:

- Admin chua bat `Cong khai`.
- `displayOrder` dang nho hon 0.
- So luong logo hien thi tren trang chu da dat gioi han.
- Ho so thieu logo.

Cach xu ly:

- Admin kiem tra `/admin/partners`.
- Dat `displayOrder >= 0`.
- Upload logo.
- Tang so luong logo hien thi tren trang chu neu can.

### 13.4 Upload logo loi

Nguyen nhan co the:

- File khong phai anh.
- File qua lon hoac khong phu hop cau hinh upload.
- Moi truong deploy khong ho tro luu file dai han.

Cach xu ly:

- Thu lai voi file PNG/JPG dung luong nho hon.
- Dung logo ro net, kich thuoc vua phai.
- Neu deploy tren Vercel, can luu y gioi han file upload va can nhac dung external storage cho file quan trong.

## 14. Checklist cho doanh nghiep truoc khi gui duyet

Truoc khi bam `Gui duyet`, hay kiem tra:

- Ten doanh nghiep viet dung va nhat quan voi ten phap ly/thuong hieu.
- Logo ro net.
- Website dung dinh dang va truy cap duoc neu co.
- Email lien he la email chinh thuc.
- So dien thoai dung.
- Tinh/thanh pho chinh xac.
- Mo ta ngan gon, ro linh vuc va gia tri hop tac.
- Khong co thong tin nhay cam hoac thong tin chua duoc phep cong khai.

## 15. Checklist cho admin truoc khi cong khai doi tac

Truoc khi hien thi doi tac cong khai, admin nen kiem tra:

- Ho so co ten doanh nghiep ro rang.
- Logo phu hop va khong bi vo/hong.
- Website/email/so dien thoai hop le neu duoc cung cap.
- Mo ta khong vi pham chinh sach noi dung.
- Trang thai duyet da phu hop.
- `Cong khai` da duoc bat neu muon hien thi.
- `Da xac minh` da duoc bat neu da kiem tra.
- `displayOrder` hop le.
- So luong logo hien thi tren trang chu phu hop voi thiet ke.

## 16. Duong dan nhanh

- Tham gia mang luoi doi tac: `/join-us`
- Dang ky doanh nghiep: `/auth/signup?role=business`
- Dang nhap: `/auth/signin`
- Ho so doanh nghiep: `/business/profile`
- Khoi tao ho so doanh nghiep: `/business/profile?init=1`
- Trang doi tac cong khai: `/partners`
- Thong tin tai khoan: `/account`
- Admin quan ly nguoi dung: `/admin/users`
- Admin quan ly doi tac: `/admin/partners`

