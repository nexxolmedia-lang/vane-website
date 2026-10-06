/**
 * VĀNE — central image registry.
 * Every photograph used on the site is declared here once, then referenced
 * by key from products, collections, articles and page templates.
 * Swap `src` for local files (e.g. "assets/images/form-01.jpg") without touching markup.
 */
(function (V) {
'use strict';

const UNSPLASH = 'https://images.unsplash.com/photo-';

const photo = (id, alt, focus = '50% 35%') => ({ id, alt, focus });

const media = {
  /* Outerwear */
  coatBlackWall: photo('1596451984287-7a274406cbca', 'زن با پالتوی مشکی تکیه داده به دیوار بتنی خاکستری', '50% 30%'),
  coatBlackStairs: photo('1771512650102-bca0235a184a', 'پالتوی مشکی بلند روی پله‌های سنگی'),
  coatBlackEscalator: photo('1771512650131-2baf7a8ccb25', 'پالتوی مشکی در فضای شهری مدرن'),
  coatTrenchFocus: photo('1573003117168-4d2cea8bc84a', 'جزئیات بارانی مشکی با فوکوس کم'),
  coatBlackStatues: photo('1766513676429-6260396b40cd', 'پالتوی مشکی کنار نمای سنگی ساختمان'),
  coatBrownGate: photo('1618244972963-dbee1a7edc95', 'پالتوی قهوه‌ای کنار دروازه‌ی فلزی مشکی'),
  coatBrownStairs: photo('1618333452884-5c8d211ed2ad', 'پالتوی قهوه‌ای و شلوار خاکستری روی پله‌های بتنی روشن'),
  coatTrenchGlass: photo('1544246108-14b45872b02d', 'بارانی قهوه‌ای روشن مقابل در شیشه‌ای'),
  coatTrenchStation: photo('1788120680424-60c0069f9e61', 'بارانی بژ در ایستگاه قطار'),
  coatBeigeRoad: photo('1589400445193-c881a4b0b38a', 'پالتوی بژ در خیابان، نور گرم روز'),
  coatHat: photo('1653875842174-429c1b467548', 'پالتوی بلند و کلاه، ترکیب مینیمال'),
  coatLong: photo('1668952135120-7d997b1b3778', 'زن با پالتوی بلند، سیلوئت کشیده'),
  coatWhiteHat: photo('1617733401065-c7bdf0b33417', 'پالتوی سفید و کلاه قهوه‌ای'),
  coatAlbum: photo('1565101129934-0da84e9fd368', 'پالتوی قهوه‌ای در نور طبیعی'),

  /* Tailoring */
  blazerPearl: photo('1612731486606-2614b4d74921', 'کت مشکی و گردنبند مروارید مقابل دیوار کرم', '50% 25%'),
  blazerConfident: photo('1748290880596-2a2c80530bc0', 'زن با کت مشکی در ژستی آرام و مطمئن'),
  blazerWhiteWall: photo('1779400201925-6c6048bee7e5', 'کت مشکی مقابل دیوار سفید'),
  blazerLean: photo('1779400202564-ac01487e35e7', 'کت مشکی، تکیه به دیوار سفید'),
  blazerHair: photo('1762341125028-47886b038f35', 'زن با کت مشکی در حال مرتب کردن موها'),
  blazerSuit: photo('1748279665036-1b3c858c7654', 'پرتره‌ی زن با کت و شلوار'),
  blazerShelf: photo('1762341120551-6a021d18933a', 'کت و شلوار مشکی کنار قفسه'),
  blazerMono: photo('1701286502003-0a2e4ba3962b', 'عکس سیاه و سفید زن با کت و شلوار'),
  blazerBuilding: photo('1762343284805-0f8d78d0e542', 'کت روشن مقابل ساختمان مدرن'),
  blazerSculpture: photo('1762343285592-b298b78b3574', 'کت روشن کنار مجسمه‌ی معاصر'),
  blazerPocket: photo('1613915617430-8ab0fd7c6baf', 'کت و شلوار با دست در جیب'),
  blazerBed: photo('1629511565591-a1d494ad6c58', 'کت مشکی در فضای داخلی مینیمال'),
  suitBeige: photo('1779406167603-d0afe0a4cdd7', 'کت و شلوار بژ و شاخه‌ی خشک'),
  suitBrick: photo('1777982822080-9111f2ed8213', 'کت و شلوار مشکی بیرون ساختمان آجری'),
  suitRooftop: photo('1764264829034-41a1f80d92f0', 'کت و شلوار روی بام شهر'),

  /* Dresses & skirts */
  dressBlackWood: photo('1759229874810-26aa9a3dda92', 'پیراهن مشکی مقابل دیوارپوش چوبی'),
  dressBlackPier: photo('1645400118924-9ae0f2fe85ac', 'پیراهن بلند مشکی روی اسکله'),
  dressWhite: photo('1659522761084-79196b64abe4', 'پیراهن سفید بلند'),
  dressMuseum: photo('1649702161417-6dad11f2dabc', 'زن در موزه مقابل یک نقاشی'),
  dressWhiteStrap: photo('1584287981937-67ab60932edf', 'پیراهن سفید بندی'),
  dressLong: photo('1723015973566-1cb80ebe9aa9', 'پیراهن بلند کنار دیوار'),
  dressWhiteBuilding: photo('1762337675601-4ff36403ec75', 'زن مقابل ساختمان سفید مدرن'),
  dressField: photo('1755789170774-dbd7e16ea917', 'پیراهن در دشت، نور ملایم'),
  skirtBlack: photo('1699270065871-f1ae8a3b9094', 'تاپ و دامن مشکی'),
  skirtShirt: photo('1708363390847-b4af54f45273', 'پیراهن سفید و دامن مشکی'),
  skirtWoodFloor: photo('1627660561449-1b8381504c88', 'پیراهن سفید و دامن مشکی روی کف چوبی'),
  skirtHallway: photo('1706816997322-33d3dee00e47', 'دامن بلند در راهرو'),

  /* Shirts, tops, knitwear */
  shirtWall: photo('1636153279424-cb5d1e00f5a2', 'زن مقابل دیوار ساده'),
  shirtWhite: photo('1612485842581-0dce50d5268f', 'پیراهن سفید آستین بلند'),
  shirtWhiteBlack: photo('1708434050128-e38fe9859a39', 'پیراهن سفید و شلوار مشکی'),
  shirtShadows: photo('1763311159952-3afa0ee330c2', 'سایه‌های خطی روی دیوار بافت‌دار'),
  shirtMono: photo('1597210100639-672b9800c7d0', 'پرتره‌ی سیاه و سفید'),
  shirtWaist: photo('1669059921524-327a4c52cff3', 'جزئیات کمر و پیراهن'),
  shirtArms: photo('1659800776839-75192d08417a', 'دست‌های در هم، پیراهن ساده'),
  blouseBlack: photo('1576193929684-06c6c6a8b582', 'بلوز مشکی آستین بلند'),
  trouserBlack: photo('1762331224129-783a3ea1fc3f', 'لباس تمام مشکی مقابل ساختمان مدرن'),
  trouserTower: photo('1713145872687-4f7d5e18bbac', 'زن مقابل ساختمان بلند'),
  trouserWhiteShirt: photo('1580651214613-f4692d6d138f', 'پیراهن سفید و شلوار'),
  trouserBurgundy: photo('1790384074526-30550d190a7c', 'تی‌شرت مشکی و شلوار زرشکی'),
  coatBurgundy: photo('1790384070481-d4eefe6d509b', 'کت زرشکی و شلوار کنار دیوار'),
  knitGrey: photo('1574201635302-388dd92a4c3f', 'بافت خاکستری'),
  knitScarf: photo('1604176132453-922aeee365df', 'پیراهن سفید و شال قهوه‌ای'),
  knitBrown: photo('1610460894518-5067fcb96aab', 'بافت قهوه‌ای'),
  knitBrownStanding: photo('1624558525725-98fced271018', 'بافت قهوه‌ای، ایستاده'),
  foldedClothes: photo('1633008004535-b255bab275cc', 'لباس‌های تاشده روی سطح سفید'),

  /* Editorial */
  editBlock: photo('1638265499174-62c2cb29137a', 'زن نشسته روی حجم سفید هندسی'),
  editStool: photo('1654512697681-8434b50096dd', 'زن نشسته روی چهارپایه'),
  editWindow: photo('1506619928596-bb8c201545cc', 'زن روی پله‌ها کنار پنجره'),
  editLedge: photo('1654336204238-76ac53034e70', 'زن نشسته روی لبه‌ی دیوار'),
  editFlower: photo('1571513800374-df1bbe650e56', 'گل خشک در دست'),
  editStairsWalk: photo('1663343682859-9ff71ee439e3', 'عبور از پله‌ها'),

  /* Material & architecture */
  textureLinen: photo('1528458909336-e7a0adfed0a5', 'بافت پارچه‌ی کتان بژ', '50% 50%'),
  textureBrown: photo('1591195854242-8804547cdcab', 'نمای نزدیک پارچه‌ی قهوه‌ای', '50% 50%'),
  textureGrey: photo('1643313262988-cdc5f50c6019', 'بافت پارچه‌ی خاکستری', '50% 50%'),
  textureKnit: photo('1619459074324-33d5f591c53e', 'بافت کشباف قهوه‌ای و مشکی', '50% 50%'),
  textureWool: photo('1605871665507-46679ed05528', 'لایه‌های پارچه‌ی پشمی قهوه‌ای', '50% 50%'),
  archStairs: photo('1520529890308-f503006340b4', 'پله‌های بتنی سفید', '50% 50%'),
  archMonolith: photo('1522743791393-522312deeebf', 'حجم بتنی یکپارچه', '50% 50%'),
  archConcrete: photo('1565371557106-c2abcc6fb36a', 'ساختمان بتنی خاکستری', '50% 50%'),
  archMono: photo('1738844153737-5d2525178e49', 'معماری سیاه و سفید', '50% 50%'),
  archLowAngle: photo('1554201791-f9fcfba504a0', 'نمای پایین به بالای ساختمان بتنی', '50% 50%'),

  /* Atelier */
  atelierSpools: photo('1771555557406-d1cae82cdbca', 'قرقره‌های نخ روی چهارپایه‌های چوبی', '50% 50%'),
  atelierCutting: photo('1787505136265-9a99dad3bbac', 'برش پارچه‌ی سفید در آتلیه', '50% 50%'),
  atelierMannequin: photo('1787505136296-1e8f0750e5ff', 'تنظیم لباس روی مانکن در نور کم', '50% 40%'),
  atelierNotes: photo('1787505136259-5195dfbfcd01', 'یادداشت‌برداری در آتلیه', '50% 40%'),
  atelierWorkshop: photo('1770910195240-ddec777b77f6', 'مانکن‌ها و ابزار دوخت در کارگاه', '50% 50%')
};

/** Build a sized, cropped image URL. */
function imageUrl(image, width = 1200, ratio = 4 / 3) {
  if (!image) return '';
  if (image.src) return image.src;
  const height = Math.round(width * ratio);
  return `${UNSPLASH}${image.id}?auto=format&fit=crop&crop=faces,entropy&w=${width}&h=${height}&q=72`;
}

/** Resolve a registry key or image object. */
const getMedia = (keyOrImage) =>
  typeof keyOrImage === 'string' ? media[keyOrImage] : keyOrImage;

const WIDTHS = [360, 540, 720, 960, 1280, 1680];

/**
 * Responsive <img> markup.
 * ratio = height / width (e.g. 4/3 for portrait 3:4 crops).
 */
function imgTag(keyOrImage, {
  ratio = 4 / 3,
  sizes = '100vw',
  eager = false,
  className = '',
  alt
} = {}) {
  const image = getMedia(keyOrImage);
  if (!image) return '';
  const base = 960;
  const srcset = image.src ? '' : WIDTHS.map((w) => `${imageUrl(image, w, ratio)} ${w}w`).join(', ');
  return `<img src="${imageUrl(image, base, ratio)}"${srcset ? ` srcset="${srcset}" sizes="${sizes}"` : ''}
    width="${base}" height="${Math.round(base * ratio)}"
    alt="${alt ?? image.alt}" style="object-position:${image.focus}"
    loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}
    ${className ? `class="${className}"` : ''}>`;
}

Object.assign(V, { imageUrl, imgTag, media, getMedia });
})(window.VANE = window.VANE || {});
