/**
 * VĀNE — collections and lookbook stories (fictional).
 */
(function (V) {
'use strict';
const { media } = V;

const collections = [
  {
    slug: 'form',
    title: 'FORM',
    number: '01',
    season: 'AUTUMN / WINTER 2026',
    seasonFa: 'پاییز و زمستان ۱۴۰۵',
    concept: 'A study in proportion, movement and restraint.',
    conceptFa: 'مطالعه‌ای در تناسب، حرکت و خویشتن‌داری.',
    intro: 'FORM از یک پرسش ساده شروع شد: یک لباس چقدر می‌تواند کم داشته باشد و هنوز کامل باشد؟ پاسخ را در نماهای بتنی، پله‌های سنگی و سایه‌های بلند عصر تبریز جست‌وجو کردیم. حاصل، مجموعه‌ای است از کت‌های ساختاریافته، شلوارهای پاچه‌گشاد و پالتوهای ستونی که با حذف جزئیات، به شانه و خط اجازه‌ی حرف زدن می‌دهند.',
    hero: media.coatBlackWall,
    cover: media.blazerPearl,
    chapters: [
      {
        label: 'PROPORTION',
        labelFa: 'تناسب',
        text: 'شانه‌ها کمی پهن‌تر، کمر کمی بالاتر، پاچه‌ها کمی بلندتر. تغییرهایی که به چشم نمی‌آیند اما حس می‌شوند.',
        image: media.blazerWhiteWall
      },
      {
        label: 'MOVEMENT',
        labelFa: 'حرکت',
        text: 'پارچه‌ها را برای لحظه‌ی راه رفتن انتخاب کردیم: وزنی که فرم را می‌سازد و در حرکت، آرام رها می‌شود.',
        image: media.coatBlackStairs
      },
      {
        label: 'RESTRAINT',
        labelFa: 'خویشتن‌داری',
        text: 'بدون لوگو، بدون تزئین، بدون فلز براق. هر چیزی که لازم نبود، حذف شد.',
        image: media.archStairs
      }
    ]
  },
  {
    slug: 'stillness',
    title: 'STILLNESS',
    number: '02',
    season: 'SPRING / SUMMER 2026',
    seasonFa: 'بهار و تابستان ۱۴۰۵',
    concept: 'Light, linen and the quiet hours of the afternoon.',
    conceptFa: 'نور، کتان و ساعت‌های آرام بعدازظهر.',
    intro: 'STILLNESS درباره‌ی مکث است. ابریشم سنگین، کتان شسته و رنگ‌هایی که از گچ، سنگ و برگ زیتون گرفته شده‌اند. لباس‌هایی برای گرمای ظهر و خنکای شب؛ بی‌صدا، اما حاضر.',
    hero: media.dressWhite,
    cover: media.dressWhiteBuilding,
    chapters: [
      {
        label: 'LIGHT',
        labelFa: 'نور',
        text: 'سفیدهای گرم و ابریشم مات؛ سطح‌هایی که نور را جذب می‌کنند و برق نمی‌زنند.',
        image: media.dressWhiteStrap
      },
      {
        label: 'PAUSE',
        labelFa: 'مکث',
        text: 'برش‌های مورب که روی بدن آرام می‌گیرند و هیچ‌چیز را تحمیل نمی‌کنند.',
        image: media.skirtHallway
      },
      {
        label: 'EARTH',
        labelFa: 'خاک',
        text: 'زیتونی، خاکی و سنگی؛ پالتی که از حیاط‌های قدیمی تبریز آمده است.',
        image: media.textureLinen
      }
    ]
  },
  {
    slug: 'north',
    title: 'NORTH',
    number: '03',
    season: 'WINTER CAPSULE 2026',
    seasonFa: 'کپسول زمستان ۱۴۰۵',
    concept: 'Wool, weight and the long northern winter.',
    conceptFa: 'پشم، وزن و زمستان طولانی شمال.',
    intro: 'زمستان در تبریز طولانی و روشن است. NORTH کپسولی است از پالتوهای پشم و کشمیر، بافت‌های ضخیم و شلوارهای فلانل؛ لباس‌هایی که گرما را با وقار همراه می‌کنند.',
    hero: media.coatBrownGate,
    cover: media.coatTrenchGlass,
    chapters: [
      {
        label: 'WEIGHT',
        labelFa: 'وزن',
        text: 'پشم دولایه و فلانل سنگین؛ لباس‌هایی که روی شانه حس می‌شوند.',
        image: media.coatBrownStairs
      },
      {
        label: 'WARMTH',
        labelFa: 'گرما',
        text: 'کشمیر و پشم یاک، بافته‌شده برای لایه‌لایه پوشیدن.',
        image: media.knitBrown
      },
      {
        label: 'DEPTH',
        labelFa: 'عمق',
        text: 'شتری، زغالی و یک زرشکی عمیق؛ رنگ‌هایی برای روزهای کوتاه.',
        image: media.trouserBurgundy
      }
    ]
  }
];

const getCollection = (slug) => collections.find((c) => c.slug === slug);

/** Lookbook — "THE SHAPE OF SILENCE", six looks from FORM / 01 */
const lookbook = {
  title: 'THE SHAPE OF SILENCE',
  titleFa: 'شکل سکوت',
  collection: 'form',
  intro: 'شش تصویر از FORM / 01 در معماری مدرن تبریز. عکاسی در نور طبیعی اواخر مهر، بدون نور مصنوعی و بدون روتوش سنگین.',
  looks: [
    {
      layout: 'full',
      title: 'FORM',
      caption: 'ایستادن، بدون عجله.',
      image: media.coatBlackWall,
      products: ['form-04-coat', 'form-02-trouser']
    },
    {
      layout: 'offset',
      title: 'LINE',
      caption: 'شانه‌ای که خط افق را ادامه می‌دهد.',
      image: media.blazerPearl,
      detail: media.archStairs,
      products: ['form-01-blazer', 'form-03-shirt']
    },
    {
      layout: 'type',
      title: 'WEIGHT',
      caption: 'پارچه‌ای که حرکت را کند می‌کند.',
      image: media.dressBlackWood,
      products: ['form-05-dress']
    },
    {
      layout: 'pair',
      title: 'ECHO',
      caption: 'دو حالت از یک فرم.',
      image: media.blazerSuit,
      detail: media.blazerMono,
      products: ['form-08-double-blazer', 'form-06-skirt']
    },
    {
      layout: 'narrow',
      title: 'STILL',
      caption: 'سکوت، به‌مثابه‌ی انتخاب.',
      image: media.coatTrenchFocus,
      products: ['signature-00-cape-coat']
    },
    {
      layout: 'closing',
      title: 'REMAIN',
      caption: 'برای دیده شدن ساخته نشده. برای ماندن ساخته شده.',
      image: media.knitGrey,
      detail: media.textureKnit,
      products: ['form-07-knit-top', 'form-06-skirt']
    }
  ]
};

Object.assign(V, { collections, getCollection, lookbook });
})(window.VANE = window.VANE || {});
