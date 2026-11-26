import { Book } from '../types/library';

export const HERO_LIBRARY_IMAGE =
  '/src/assets/images/hero_kids_library_1795677124301.jpg';

export const LIBRARY_BOOKS: Book[] = [
  {
    id: 'kancil-dan-lentera-kunang-kunang',
    accessionCode: 'AN-2026-01',
    title: 'Kancil dan Lentera Kunang-Kunang',
    subtitle: 'Dongeng Hutan Malam tentang Berbagi Cahaya dan Menolong Sahabat',
    author: 'Kak Rini Lestari',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Fabel & Dongeng',
    ageGroup: '4–6 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 6,
    audioMinutes: 8,
    coverImage: '/src/assets/images/cover_kancil_lentera_1795677124672.jpg',
    coverAlt:
      'Ilustrasi buku anak bernuansa biru senja memperlihatkan seekor kancil kecil ramah memegang lentera kertas hangat di tengah hutan yang dipenuhi kunang-kunang.',
    coverAccentHex: '#1E3A8A',
    summary:
      'Ketika matahari terbenam lebih cepat di Rimba Teduh, Kiko si Kancil membawa lentera hangat untuk memandu anak landak yang ketakutan pulang ke rumahnya.',
    accessibilityNotes: [
      'Kalimat pendek dan ritmis untuk anak usia dini serta pembaca awal',
      'Dilengkapi kamus kata baru bersuara di setiap bab',
      'Deskripsi suasana hutan disajikan secara ramah pendengar',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Senja Datang Lebih Cepat',
        summary:
          'Langit Rimba Teduh berubah ungu saat Kiko menyalakan lentera kertasnya.',
        marginNote:
          'Bayangkan suasana hutan menjelang malam: suara jangkrik mulai bernyanyi pelan dan udara terasa sejuk di pipi.',
        glossary: [
          {
            word: 'Lentera',
            meaning: 'Lampu kecil bertutup kertas atau kaca yang bisa dijinjing saat berjalan di tempat gelap.',
          },
          {
            word: 'Rimba',
            meaning: 'Hutan yang lebat dengan banyak pohon tinggi dan hewan yang hidup rukun.',
          },
        ],
        question: {
          prompt: 'Mengapa Kiko membawa lentera saat berjalan di hutan?',
          options: [
            'Untuk menerangi jalan setapak yang mulai gelap',
            'Untuk memancing ikan di sungai besar',
            'Untuk memasak sup wortel hangat',
          ],
          correctIndex: 0,
          explanation:
            'Benar sekali! Kiko membawa lentera agar jalan setapak di hutan tetap terlihat aman saat senja tiba.',
        },
        paragraphs: [
          'Matahari baru saja bersembunyi di balik bukit ketika langit Rimba Teduh berubah menjadi biru tua yang lembut. Angin sore berdesir pelan di sela daun pakis, membawa wangi tanah basah setelah hujan.',
          'Kiko si Kancil mengenakan sweter rajut kesayangannya lalu mengangkat sebuah lentera kertas berwarna kuning hangat. Di luar jendela rumahnya, belasan kunang-kunang kecil menari seperti bintang yang turun ke taman.',
          'Tiba-tiba terdengar suara isakan halus dari balik semak bunga sepatu. Ternyata Dodo si anak landak tersesat karena lupa arah jalan pulang menuju lubang pohonnya.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Tarian Cahaya Kunang-Kunang',
        summary:
          'Kiko mengajak para kunang-kunang membantu menerangi jembatan kayu.',
        marginNote:
          'Saat berjalan bersama, Kiko mengetukkan kaki pelan supaya Dodo selalu tahu ke mana harus melangkah.',
        glossary: [
          {
            word: 'Jembatan',
            meaning: 'Jalan kayu atau batu yang dibangun di atas sungai agar mudah diseberangi.',
          },
          {
            word: 'Berpendar',
            meaning: 'Memancarkan cahaya lembut yang berkelip-kelip dalam gelap.',
          },
        ],
        question: {
          prompt: 'Siapa yang ikut membantu menerangi jembatan kayu?',
          options: [
            'Sekawanan kunang-kunang yang bercahaya lembut',
            'Burung hantu yang sedang tertidur pulas',
            'Kura-kura dari danau sebelah',
          ],
          correctIndex: 0,
          explanation:
            'Hebat! Sekawanan kunang-kunang terbang berbaris rapi untuk membantu menerangi jembatan kayu.',
        },
        paragraphs: [
          'Jangan takut ya Dodo, kata Kiko sambil tersenyum ramah dan menurunkan lenteranya agar sejajar dengan mata sahabatnya. Aku akan menemanimu berjalan sampai ke depan pintu rumahmu.',
          'Melihat kebaikan Kiko, sekawanan kunang-kunang terbang berbaris di sepanjang jembatan kayu kecil di atas sungai. Cahaya hijau kekuningan mereka berpendar lembut menerangi setiap papan jembatan.',
          'Kiko berjalan di depan sambil mengetukkan ranting kecil pada tanah secara teratur. Bunyi ketukan itu membuat Dodo merasa tenang dan bisa mengikuti langkah Kiko dengan gembira.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Rumah Hangat dan Sup Jagung',
        summary:
          'Dodo tiba di rumah dengan selamat dan semua sahabat berbagi makan malam.',
        marginNote:
          'Menolong teman dengan sabar membuat perjalanan yang terasa jauh menjadi singkat dan penuh tawa.',
        glossary: [
          {
            word: 'Syukur',
            meaning: 'Perasaan gembira dan berterima kasih atas kebaikan yang kita terima.',
          },
        ],
        question: {
          prompt: 'Pelajaran baik apa yang kita dapat dari kisah Kiko?',
          options: [
            'Berbagi cahaya dan menolong teman membuat semua merasa aman',
            'Kita tidak boleh keluar rumah di pagi hari',
            'Kunang-kunang hanya hidup di laut dalam',
          ],
          correctIndex: 0,
          explanation:
            'Tepat! Berbagi kebaikan dan membantu teman yang kesulitan membuat hutan menjadi tempat yang ramah bagi semua.',
        },
        paragraphs: [
          'Tak lama kemudian, tampaklah pintu bulat rumah keluarga landak di kaki pohon beringin tua. Ibu Dodo membuka pintu sambil memeluk anaknya erat dengan penuh rasa syukur.',
          'Sebagai ucapan terima kasih, Ibu Dodo menuangkan semangkuk sup jagung manis hangat untuk Kiko. Para kunang-kunang pun ikut beristirahat di atas daun jambu sambil mendengarkan tawa mereka.',
          'Malam itu Kiko pulang dengan hati yang jauh lebih hangat daripada lentera di tangannya. Ia tahu bahwa satu cahaya kecil yang dibagi bersama dapat menerangi seluruh hutan.',
        ],
      },
    ],
  },
  {
    id: 'petualangan-riri-si-tetes-air',
    accessionCode: 'AN-2026-02',
    title: 'Petualangan Riri Si Tetes Air',
    subtitle: 'Belajar Siklus Air dari Lautan, Awan Kapas, hingga Taman Bunga',
    author: 'Bunda Melati Putri',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Sains Anak',
    ageGroup: '7–9 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 8,
    audioMinutes: 10,
    coverImage: '/src/assets/images/cover_tetes_air_1795677125344.jpg',
    coverAlt:
      'Ilustrasi cat air buku anak bergambar setetes air biru tersenyum ceria melayang di samping awan putih lembut di atas bukit hijau dan sungai berkilau.',
    coverAccentHex: '#0369A1',
    summary:
      'Ikuti perjalanan seru Riri si tetes air yang berubah menjadi uap ringan, berkumpul menjadi awan putih, lalu turun sebagai hujan segar menyirami bumi.',
    accessibilityNotes: [
      'Menjelaskan proses sains siklus air lewat cerita imajinatif',
      'Istilah ilmiah seperti penguapan dan pengembunan dijelaskan sederhana',
      'Cocok dibacakan dengan suara antarmuka untuk latihan menyimak',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Terbang Bersama Sinar Matahari',
        summary:
          'Riri berubah menjadi uap air yang ringan saat sinar matahari pagi menghangatkan laut.',
        marginNote:
          'Proses sains: Ketika air terkena panas matahari dan naik ke udara sebagai gas tak terlihat, itu disebut penguapan.',
        glossary: [
          {
            word: 'Menguap',
            meaning: 'Berubah dari benda cair seperti air menjadi gas ringan yang naik ke udara.',
          },
          {
            word: 'Samudra',
            meaning: 'Lautan yang sangat luas dan dalam di permukaan bumi.',
          },
        ],
        question: {
          prompt: 'Apa yang membantu Riri naik melayang dari laut ke langit?',
          options: [
            'Kehangatan sinar matahari pagi',
            'Balon udara milik petani',
            'Sayap burung camar putih',
          ],
          correctIndex: 0,
          explanation:
            'Benar! Sinar matahari menghangatkan permukaan laut sehingga air menguap dan naik ringan ke langit.',
        },
        paragraphs: [
          'Di sebuah teluk biru yang tenang, tinggallah Riri, setetes air laut yang suka berpetualang. Setiap pagi ia melompat kecil mengikuti irama ombak sambil menyapa ikan badut di dekat karang.',
          'Suatu siang yang cerah, sinar matahari menyinari permukaan samudra dengan hangat. Tubuh Riri perlahan terasa semakin ringan hingga ia berubah menjadi uap air yang melayang naik menembus udara.',
          'Dari atas ketinggian, Riri bisa melihat perahu nelayan tampak sebesar biji kacang hijau. Angin laut membawanya terbang semakin tinggi menuju langit biru yang sejuk.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Berkumpul di Istana Awan Kapas',
        summary:
          'Di langit yang dingin, uap air berkumpul kembali menjadi butiran awan putih.',
        marginNote:
          'Proses sains: Uap air yang mendingin di ketinggian berubah kembali menjadi titik air kecil membentuk awan. Ini disebut pengembunan.',
        glossary: [
          {
            word: 'Mengembun',
            meaning: 'Perubahan uap air di udara dingin menjadi butiran air kecil kembali.',
          },
        ],
        question: {
          prompt: 'Mengapa uap air di langit berkumpul membentuk awan?',
          options: [
            'Karena udara di langit atas sangat dingin sehingga uap mengembun',
            'Karena bulan menarik awan dengan tali perak',
            'Karena angin lupa meniup ke barat',
          ],
          correctIndex: 0,
          explanation:
            'Pintar! Udara dingin di atas membuat uap air mengembun menjadi titik-titik air kecil pembentuk awan.',
        },
        paragraphs: [
          'Semakin tinggi Riri terbang, udara di sekitarnya terasa makin dingin seperti di dalam lemari es raksasa. Di sana ia bertemu jutaan teman uap air lain dari sungai, danau, dan hutan.',
          'Karena kedinginan, mereka saling berpegangan erat dan berubah kembali menjadi titik-titik air mungil. Bersama-sama mereka membentuk gumpalan awan putih lembut menyerupai kapas raksasa.',
          'Awan tempat Riri berada terus meluncur ditiup angin pegunungan ke arah daratan hijau. Di bawah sana tampak bukit teh, desa kecil, dan kebun sayur yang sedang menantikan kesegaran.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Hujan Musik di Atas Kebun Bunga',
        summary:
          'Riri turun sebagai rintik hujan yang menyegarkan tanah dan kembali ke sungai.',
        marginNote:
          'Coba dengarkan bunyi hujan di atap atau daun: tik, tik, tik—itu adalah air yang kembali memberi kehidupan bagi tanaman.',
        glossary: [
          {
            word: 'Siklus',
            meaning: 'Perputaran kejadian yang berlangsung terus-menerus dan kembali ke awal.',
          },
        ],
        question: {
          prompt: 'Ke mana Riri mengalir setelah menyirami kebun dan bukit?',
          options: [
            'Mengalir lewat sungai kecil kembali menuju laut',
            'Berubah menjadi batu kerikil di jalan',
            'Terbang langsung ke planet Mars',
          ],
          correctIndex: 0,
          explanation:
            'Betul sekali! Air hujan meresap ke tanah dan mengalir melalui sungai untuk kembali ke laut, mengulang siklus air.',
        },
        paragraphs: [
          'Ketika awan sudah terlalu penuh dan berat, Riri bersama jutaan sahabatnya bersiap meluncur turun sebagai rintik hujan. Tik, tik, tik, mereka menari riang di atas daun talas dan genting rumah warga.',
          'Bunga melati dan pohon mangga segera menegakkan daunnya yang tadinya layu. Sebagian air meresap ke akar tanaman, sementara Riri meluncur gembira masuk ke aliran sungai jernih.',
          'Sungai berkelok-kelok membawa Riri melewati sawah hijau hingga kembali bermuara di lautan luas. Perjalanan itu tidak pernah berakhir karena alam selalu menjaga siklus air berputar sepanjang masa.',
        ],
      },
    ],
  },
  {
    id: 'lagu-tangan-raka-dan-dina',
    accessionCode: 'AN-2026-03',
    title: 'Lagu Tangan Raka dan Dina',
    subtitle: 'Kisah Persahabatan Belajar Bahasa Isyarat dan Buku Timbul di Sekolah',
    author: 'Siti Aisyah',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Persahabatan & Inklusi',
    ageGroup: '7–9 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 8,
    audioMinutes: 10,
    coverImage: '/src/assets/images/cover_lagu_tangan_1795677125803.jpg',
    coverAlt:
      'Ilustrasi buku anak bergaya lukisan guas hangat menampilkan dua siswa sekolah dasar Indonesia duduk di bawah pohon rindang membaca buku bergambar timbul bersama diiringi kupu-kupu dan not musik.',
    coverAccentHex: '#9A3412',
    summary:
      'Dina seorang siswi Tuli dan Raka teman barunya yang bermata kurang awas saling bertukar cara unik membaca cerita dan bernyanyi lewat gerak tangan.',
    accessibilityNotes: [
      'Memperkenalkan nilai empati, bahasa isyarat, dan huruf timbul sejak dini',
      'Mengajarkan anak bahwa setiap teman punya cara hebat untuk berkomunikasi',
      'Dukungan penuh pembaca layar dan unduhan teks ramah anak',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Tikar Bambu di Bawah Pohon Kersen',
        summary:
          'Raka dan Dina bertemu saat jam istirahat di pojok baca taman sekolah.',
        marginNote:
          'Catatan Inklusi: Bahasa Isyarat Indonesia (BISINDO) menggunakan gerakan tangan dan ekspresi wajah yang ekspresif untuk berbicara.',
        glossary: [
          {
            word: 'Isyarat',
            meaning: 'Tanda komunikasi menggunakan gerak tangan dan ekspresi wajah tanpa suara.',
          },
          {
            word: 'Timbul',
            meaning: 'Permukaan huruf atau gambar yang menonjol sehingga bisa diraba dengan jari.',
          },
        ],
        question: {
          prompt: 'Apa yang dibawa Dina saat duduk di atas tikar bambu?',
          options: [
            'Buku dongeng bergambar timbul berwarna cerah',
            'Bola basket berukuran besar',
            'Sepeda roda tiga berwarna merah',
          ],
          correctIndex: 0,
          explanation:
            'Benar! Dina membawa buku cerita bergambar timbul agar dapat dinikmati bersama oleh Raka.',
        },
        paragraphs: [
          'Saat bel istirahat berbunyi, siswa-siswa SD Pelangi berlarian ke halaman sekolah yang teduh oleh pohon kersen. Di atas tikar bambu yang rapi, Dina membuka sebuah buku cerita bergambar timbul berwarna hijau cerah.',
          'Raka duduk di sampingnya sambil membawa kacamata tebal kesayangannya. Karena penglihatan Raka agak kabur pada huruf kecil, ia senang sekali meraba bentuk daun dan kelopak bunga timbul pada buku Dina.',
          'Dina yang berkomunikasi memakai bahasa isyarat tersenyum lebar melihat antusiasme Raka. Ia menunjuk gambar burung pipit lalu menggerakkan kedua ibu jarinya seperti sayap yang mengepak.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Mengenal Huruf dengan Jari dan Gerakan',
        summary:
          'Dina mengajari Raka isyarat kata terima kasih, sementara Raka membacakan cerita.',
        marginNote:
          'Coba praktikkan: Tempelkan ujung jari di dagu lalu gerakkan pelan ke depan sambil tersenyum untuk isyarat terima kasih.',
        glossary: [
          {
            word: 'Ekspresi',
            meaning: 'Raut wajah yang menunjukkan perasaan seperti senang, kagum, atau ramah.',
          },
        ],
        question: {
          prompt: 'Bagaimana Raka dan Dina saling membantu saat membaca?',
          options: [
            'Raka membantu mengetuk irama dan bercerita, Dina mengajari gerakan isyarat',
            'Mereka membaca di kelas yang terpisah jauh',
            'Mereka menyembunyikan buku di dalam tas',
          ],
          correctIndex: 0,
          explanation:
            'Hebat! Raka dan Dina saling melengkapi sehingga membaca buku bersama jadi jauh lebih menyenangkan.',
        },
        paragraphs: [
          'Hari itu mereka berdua membuat kesepakatan kecil yang seru. Dina mengajari Raka lima kata bahasa isyarat baru, mulai dari selamat pagi, sahabat, hingga terima kasih.',
          'Sebagai gantinya, Raka meminjamkan buku audio dari perpustakaan sekolah dan mengetukkan irama tepuk tangan pelan di meja. Dina bisa merasakan getaran irama itu sambil mengikuti gerak bibir Raka yang jelas.',
          'Teman-teman sekelas yang lewat ikut berhenti karena penasaran melihat tawa mereka. Dalam sekejap, halaman bawah pohon kersen berubah menjadi klub cerita paling ramai di sekolah.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Pentas Lagu Tangan di Hari Anak',
        summary:
          'Seluruh kelas tampil menyanyikan lagu persahabatan sambil bergerak dalam bahasa isyarat.',
        marginNote:
          'Ketika semua anak diajak belajar cara komunikasi yang beragam, tidak ada lagi teman yang merasa sendirian.',
        glossary: [
          {
            word: 'Harmonis',
            meaning: 'Selaras, rukun, dan indah saat dilakukan bersama-sama.',
          },
        ],
        question: {
          prompt: 'Mengapa pertunjukan kelas mereka terasa sangat istimewa?',
          options: [
            'Karena suara nyanyian dan gerak bahasa isyarat berpadu menjadi satu',
            'Karena panggungnya dibangun di atas kolam ikan',
            'Karena tidak ada penonton yang hadir',
          ],
          correctIndex: 0,
          explanation:
            'Tepat sekali! Semua teman bisa ikut bernyanyi dan menikmati lagu bersama lewat suara sekaligus gerak tangan.',
        },
        paragraphs: [
          'Sebulan kemudian saat perayaan Hari Anak di aula sekolah, kelas Raka dan Dina menyiapkan penampilan istimewa. Mereka menyanyikan lagu tentang indahnya pelangi setelah hujan dengan iringan gerak tangan bahasa isyarat.',
          'Ibu guru juga menyiapkan papan lirik berukuran huruf ekstra besar dengan warna kontras kuning dan biru tua. Penonton bisa mendengarkan melodi musik sekaligus menyaksikan tarian jari yang harmonis.',
          'Ketika lagu selesai, seluruh aula bertepuk tangan dan mengangkat kedua telapak tangan lalu memutar-mutarnya sebagai tepuk tangan bahasa isyarat. Raka dan Dina saling bertukar senyum bangga.',
        ],
      },
    ],
  },
  {
    id: 'penjaga-terumbu-karang-kecil',
    accessionCode: 'AN-2026-04',
    title: 'Penjaga Terumbu Karang Kecil',
    subtitle: 'Cerita Anak Pesisir Menyelamatkan Rumah Ikan Badut dan Tukik Penyu',
    author: 'Danu Wicaksono',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Alam & Nusantara',
    ageGroup: '10–12 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 9,
    audioMinutes: 11,
    coverImage: '/src/assets/images/cover_terumbu_karang_1795677126283.jpg',
    coverAlt:
      'Ilustrasi gaya potongan kertas dan cat air memperlihatkan seekor tukik penyu hijau berenang gembira di atas terumbu karang warna-warni dan ikan-ikan kecil di laut biru jernih.',
    coverAccentHex: '#0F766E',
    summary:
      'Surya dan teman-teman desa pesisir bekerja sama membersihkan pantai dan menanam bibit karang agar rumah para penyu dan ikan kecil kembali asri.',
    accessibilityNotes: [
      'Menumbuhkan cinta lingkungan laut Nusantara sejak usia sekolah dasar',
      'Menggambarkan bentuk karang dan kehidupan laut lewat perumpamaan rabaan',
      'Tersedia ringkasan dan pertanyaan pemahaman di tiap bab',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Jejak Kecil di Pasir Pantai Pagi',
        summary:
          'Surya menemukan jejak tukik penyu dan kantong plastik yang menghalangi jalannya ke laut.',
        marginNote:
          'Fakta Alam: Tukik atau bayi penyu menetas di pasir lalu berjalan mengikuti pantulan cahaya bulan dan suara ombak menuju laut.',
        glossary: [
          {
            word: 'Tukik',
            meaning: 'Bayi penyu yang baru menetas dari telur di dalam pasir pantai.',
          },
          {
            word: 'Terumbu Karang',
            meaning: 'Struktur batu kapur alami di dasar laut yang menjadi rumah ribuan jenis ikan.',
          },
        ],
        question: {
          prompt: 'Apa yang menghalangi jalan bayi penyu menuju ombak laut?',
          options: [
            'Sampah plastik dan jaring tua yang tersangkut di pasir',
            'Istana pasir yang dibangun burung pelikan',
            'Batu permata berwarna hijau',
          ],
          correctIndex: 0,
          explanation:
            'Benar! Sampah plastik di pantai sangat berbahaya bagi tukik yang baru menetas.',
        },
        paragraphs: [
          'Setiap Sabtu pagi, Surya berlari menyusuri garis pantai Desa Karang Indah bersama kakaknya yang gemar memotret burung laut. Pasir putih terasa hangat di telapak kaki sementara ombak berkejaran pelan.',
          'Di dekat rumpun pandan laut, Surya melihat alur jejak kecil menyerupai rantai roda mungil menuju bibir air. Itu adalah jejak seekor tukik penyu yang baru menetas semalam.',
          'Sayangnya, beberapa meter di depan alur itu tersangkut botol plastik dan potongan tali jaring yang dibawa arus pasang. Surya segera memungut sampah tersebut agar jalan para tukik tetap lapang dan aman.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Taman Karang Bawah Air',
        summary:
          'Pak Nelayan menunjukkan peta timbul karang laut dan rumah ikan badut.',
        marginNote:
          'Bayangkan bentuk karang otak yang berlekuk seperti labirin, dan karang meja yang datar seperti payung tempat ikan berteduh.',
        glossary: [
          {
            word: 'Anemon',
            meaning: 'Hewan laut berumbai lembut mirip bunga yang menjadi rumah aman bagi ikan badut.',
          },
        ],
        question: {
          prompt: 'Mengapa terumbu karang disebut sebagai kota bagi ikan laut?',
          options: [
            'Karena karang menyediakan tempat berteduh, mencari makan, dan bertelur',
            'Karena ikan membangun rumah dari kayu di atas karang',
            'Karena di sana ada lampu lalu lintas bawah laut',
          ],
          correctIndex: 0,
          explanation:
            'Tepat! Terumbu karang melindungi ikan kecil dari arus deras dan menyediakan makanan alami.',
        },
        paragraphs: [
          'Siang harinya di balai desa, Pak Haris membawa model terumbu karang dari tanah liat bakar agar anak-anak bisa meraba bentuknya langsung. Ada karang yang berlekuk halus seperti kembang kol dan ada pula yang bercabang ramping bagaikan tanduk rusa.',
          'Terumbu karang bukan sekadar batu mati, melainkan makhluk hidup yang tumbuh sangat lambat dan menjadi kota bagi ribuan ikan, jelas Pak Haris. Di sela anemon laut yang lembut, keluarga ikan badut bersembunyi dari pemangsa.',
          'Jika air laut tetap bersih dan bebas sampah, ikan-ikan akan betah berkembang biak di dekat pantai. Penyu hijau pun selalu punya persediaan rumput laut segar.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Pasukan Kebersihan Cilik Pesisir',
        summary:
          'Anak-anak desa memasang papan himbauan ramah lingkungan dan menanam bibit karang.',
        marginNote:
          'Aksi sederhana seperti membawa botol minum sendiri mengurangi sampah plastik yang bisa hanyut ke laut.',
        glossary: [
          {
            word: 'Lestari',
            meaning: 'Tetap terjaga keadaannya secara baik dan tidak rusak hingga masa depan.',
          },
        ],
        question: {
          prompt: 'Kebiasaan baik apa yang mulai diterapkan anak-anak Desa Karang Indah?',
          options: [
            'Membawa wadah makan sendiri dan rutin memilah sampah pantai',
            'Membuang daun kering ke tengah laut',
            'Mengambil semua kerang hidup untuk dijual',
          ],
          correctIndex: 0,
          explanation:
            'Hebat! Mengurangi plastik sekali pakai menjaga laut tetap jernih dan lestari bagi semua makhluk.',
        },
        paragraphs: [
          'Minggu berikutnya, Surya mengajak dua belas teman sekolahnya membentuk kelompok Penjaga Karang Cilik. Mereka mengecat papan kayu dengan huruf besar dan simbol gambar yang mudah dipahami semua pengunjung pantai.',
          'Mereka juga bersepakat membawa botol minum isi ulang dari rumah setiap kali bermain di luar. Sampah daun dikumpulkan untuk pupuk kebun kelapa, sedangkan plastik dipisahkan untuk didaur ulang.',
          'Senja itu seekor penyu dewasa berenang tenang di perairan dangkal yang jernih. Surya tersenyum lebar karena tahu laut biru kini memiliki banyak sahabat kecil yang menjaganya.',
        ],
      },
    ],
  },
  {
    id: 'rahasia-bintang-dan-bulan',
    accessionCode: 'AN-2026-05',
    title: 'Rahasia Bintang dan Bulan',
    subtitle: 'Menjelajah Tata Surya Lewat Suara Planet dan Peta Langit Timbul',
    author: 'Kak Bagas Pradipta',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Sains Anak',
    ageGroup: '10–12 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 8,
    audioMinutes: 10,
    coverImage: '/src/assets/images/cover_kosmos_cahaya_1795675672675.jpg',
    coverAlt:
      'Ilustrasi monograf astronomi klasik bergambar lingkaran orbit planet dan rasi bintang berukir garis keemasan di atas latar biru malam.',
    coverAccentHex: '#1E293B',
    summary:
      'Mengajak pembaca cilik mengenal delapan planet tata surya, kawah bulan, dan bagaimana ilmuwan mengubah cahaya bintang menjadi musik angkasa.',
    accessibilityNotes: [
      'Menyajikan perbandingan ukuran planet dengan benda sehari-hari yang mudah dibayangkan',
      'Memperkenalkan konsep sonifikasi data luar angkasa untuk anak',
      'Dilengkapi daftar kosakata sains ramah pembaca muda',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Seandainya Matahari Sebesar Bola Basket',
        summary:
          'Membandingkan ukuran Matahari, Bumi, dan Jupiter menggunakan buah serta bola.',
        marginNote:
          'Perbandingan ukuran: Jika Matahari sebesar bola basket, Bumi hanya sebesar biji merica kecil yang berjarak puluhan langkah jauhnya.',
        glossary: [
          {
            word: 'Tata Surya',
            meaning: 'Kumpulan planet dan benda langit yang berputar mengelilingi Matahari.',
          },
          {
            word: 'Orbit',
            meaning: 'Jalur lintasan melingkar yang dilewati planet saat mengelilingi Matahari.',
          },
        ],
        question: {
          prompt: 'Planet manakah yang paling besar di dalam Tata Surya kita?',
          options: [
            'Jupiter yang sebesar buah semangka dalam perbandingan kita',
            'Merkurius yang paling dekat dengan Matahari',
            'Bulan yang mengelilingi Bumi',
          ],
          correctIndex: 0,
          explanation:
            'Benar sekali! Jupiter adalah planet terbesar di tata surya kita, jauh lebih besar daripada Bumi.',
        },
        paragraphs: [
          'Saat menatap langit malam yang cerah, bintang-bintang tampak seperti taburan garam di atas kain beludru hitam. Padahal di balik titik cahaya mungil itu terdapat planet dan matahari raksasa yang berputar teratur.',
          'Agar mudah dibayangkan tanpa harus melihat gambar jauh, bayangkan Matahari berukuran sebesar bola basket di tengah lapangan. Maka Bumi tempat kita tinggal hanyalah sebesar sebutir biji lada kecil yang berputar pada orbitnya.',
          'Planet Merkurius dan Mars berukuran lebih kecil lagi seperti butiran pasir, sedangkan Jupiter sang raksasa gas kira-kira sebesar bola tenis di antara delapan planet lainnya.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Musik dari Cincin Saturnus',
        summary:
          'Bagaimana para peneliti mengubah gelombang cahaya planet menjadi alunan nada.',
        marginNote:
          'Cincin Saturnus tersusun dari miliaran bongkahan es berkilau yang berputar seperti piringan musik raksasa.',
        glossary: [
          {
            word: 'Sonifikasi',
            meaning: 'Cara mengubah angka atau cahaya dari luar angkasa menjadi bunyi yang bisa didengar.',
          },
        ],
        question: {
          prompt: 'Apa penyusun utama cincin indah milik planet Saturnus?',
          options: [
            'Miliaran bongkahan es dan debu batu luar angkasa',
            'Pita kain sutra berwarna perak',
            'Tumpukan awan hujan dari lautan Bumi',
          ],
          correctIndex: 0,
          explanation:
            'Hebat! Cincin Saturnus tersusun dari jutaan hingga miliaran pecahan es dan batu yang mengorbit planetnya.',
        },
        paragraphs: [
          'Tahukah kamu bahwa para ilmuwan luar angkasa suka mengubah foto teleskop menjadi alunan nada yang indah? Teknik seru ini dinamakan sonifikasi agar semua orang, termasuk teman tunanetra, bisa ikut menikmati bentuk galaksi.',
          'Saat garis pemindai menyentuh cincin es Saturnus yang lebar, terdengar suara dawai tinggi yang berkelip-kelip jernih. Ketika melewati celah kosong di tengah cincin, bunyi sejenak terdiam lalu berlanjut lagi.',
          'Dengan mendengarkan musik luar angkasa, kita bisa merasakan betapa rapinya tarian planet-planet tanpa pernah saling bertabrakan.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Kawah Bulan dan Peta Bintang Taktil',
        summary:
          'Membuat bola bulan bertekstur timbul di ruang belajar bersama teman-teman.',
        marginNote:
          'Bulan tidak bercahaya sendiri; ia memantulkan cahaya Matahari dengan lembut ke Bumi di malam hari.',
        glossary: [
          {
            word: 'Kawah',
            meaning: 'Lekukan berbentuk mangkuk besar di permukaan Bulan akibat jatuhnya batu meteorit.',
          },
        ],
        question: {
          prompt: 'Mengapa Bulan tampak bersinar terang di langit malam?',
          options: [
            'Karena permukaan Bulan memantulkan cahaya dari Matahari',
            'Karena di dalam Bulan ada ribuan lampu neon',
            'Karena Bulan terbuat dari api panas',
          ],
          correctIndex: 0,
          explanation:
            'Tepat! Bulan bersinar karena memantulkan sinar Matahari, bukan memancarkan cahaya sendiri.',
        },
        paragraphs: [
          'Di ruang sains sekolah, Ibu Guru membawa sebuah bola plastik besar yang ditempeli adonan kertas menyerupai lekukan kawah Bulan. Semua anak bergantian meraba cekungan besar dan dataran halus pada bola tersebut.',
          'Dulu manusia hanya bisa melihat Bulan dari kejauhan, tetapi kini kita bisa mengenal bentang alamnya dengan jari dan suara. Setiap kawah memiliki nama tokoh ilmuwan dan penjelajah hebat dari seluruh dunia.',
          'Malam nanti jika langit cerah, cobalah ingat bahwa di atas sana ada tata surya luas yang menunggu untuk dipelajari oleh rasa ingin tahu kita.',
        ],
      },
    ],
  },
  {
    id: 'enam-titik-nada-di-taman-sekolah',
    accessionCode: 'AN-2026-06',
    title: 'Enam Titik Nada di Taman Sekolah',
    subtitle: 'Bermain Tebak Pola Braille dan Bunyi Alat Musik Sederhana',
    author: 'Kak Tara Wijaya',
    narrator: 'Suara Cerita Anak Indonesia',
    category: 'Kreativitas & Seni',
    ageGroup: '4–6 Tahun',
    year: 2026,
    language: 'Indonesia',
    readingMinutes: 6,
    audioMinutes: 8,
    coverImage: '/src/assets/images/cover_simfoni_bunyi_1795675670595.jpg',
    coverAlt:
      'Ilustrasi seni cetak minimalis bergambar lingkaran gelombang suara konsentris dan susunan titik timbul berwarna terakota di atas kertas krem hangat.',
    coverAccentHex: '#78350F',
    summary:
      'Cerita ceria tentang klub musik kecil di taman sekolah yang bermain tebak pola kancing timbul dan membuat alat musik dari botol kaca serta biji-bijian.',
    accessibilityNotes: [
      'Mengajak anak berhitung 1 sampai 6 sambil mengenal pola taktil',
      'Cocok untuk aktivitas membaca interaktif bersama orang tua atau guru',
      'Tersedia unduhan berkas Braille Unicode siap cetak',
    ],
    chapters: [
      {
        id: 'bab-1',
        number: 1,
        title: 'Kancing Kayu dan Kotak Rahasia',
        summary:
          'Mira membawa enam kancing kayu halus untuk bermain tebak huruf A sampai C.',
        marginNote:
          'Permainan seru: Coba tutup mata dan raba tiga benda berbeda di mejamu, lalu tebak namanya hanya dari sentuhan.',
        glossary: [
          {
            word: 'Pola',
            meaning: 'Susunan bentuk atau bunyi yang teratur dan mudah dikenali.',
          },
        ],
        question: {
          prompt: 'Berapa jumlah kancing kayu yang disusun Mira di atas papan?',
          options: [
            'Enam kancing kayu dalam dua baris tegak',
            'Dua puluh kancing berwarna hitam',
            'Hanya satu kancing besar',
          ],
          correctIndex: 0,
          explanation:
            'Benar! Enam titik adalah jumlah dasar dalam satu kotak huruf Braille yang sangat mudah diraba.',
        },
        paragraphs: [
          'Di bangku taman sekolah yang sejuk, Mira mengeluarkan sebuah papan kayu kecil berisi enam lubang rapi dan enam kancing halus. Teman-temannya berkumpul melingkar untuk ikut bermain tebak pola rahasia.',
          'Jika aku taruh satu kancing saja di sudut kiri paling atas, itu huruf A, kata Mira dengan suara ceria. Jika aku tambah satu lagi tepat di bawahnya menjadi dua kancing sejajar, itu berubah menjadi huruf B.',
          'Anak-anak menutup mata mereka sambil tersenyum dan bergiliran meraba susunan kancing tersebut. Ternyata ujung jari mereka sangat pintar menebak bentuk hanya dalam hitungan detik.',
        ],
      },
      {
        id: 'bab-2',
        number: 2,
        title: 'Marakas Biji Kacang Hijau',
        summary:
          'Membuat alat musik perkusi aman dari botol plastik berisi kacang hijau dan beras.',
        marginNote:
          'Setiap isi botol menghasilkan bunyi berbeda: beras berbunyi halus seperti hujan, sedangkan kacang hijau berbunyi lebih tegas.',
        glossary: [
          {
            word: 'Perkusi',
            meaning: 'Alat musik yang dimainkan dengan cara dipukul, diketuk, atau digoyangkan.',
          },
        ],
        question: {
          prompt: 'Bagaimana cara memainkan alat musik marakas buatan anak-anak?',
          options: [
            'Digoyangkan mengikuti irama lagu sehingga bijinya berbunyi',
            'Ditiup sekuat tenaga dari ujung bawah',
            'Dipetik senarnya memakai jari',
          ],
          correctIndex: 0,
          explanation:
            'Betul! Marakas dimainkan dengan cara digoyangkan sehingga menciptakan irama ceria.',
        },
        paragraphs: [
          'Setelah puas menebak huruf, giliran Bima mengeluarkan tiga botol kecil berisi beras, kacang hijau, dan manik kayu. Ketika botol-botol itu digoyangkan, terdengar bunyi srek-srek yang riang seperti marakas.',
          'Botol berisi beras berbunyi lembut menyerupai desau angin di rumput. Sementara botol berisi manik kayu menghasilkan ketukan renyah yang membuat semua kaki ikut bergoyang.',
          'Mereka memberi tanda pita bertekstur berbeda pada tutup masing-masing botol. Dengan begitu siapa pun langsung tahu isi botol hanya dengan meraba tutupnya.',
        ],
      },
      {
        id: 'bab-3',
        number: 3,
        title: 'Konser Pagi di Taman Bunga',
        summary:
          'Semua teman memainkan lagu sederhana sambil membaca pola kartu timbul bersama.',
        marginNote:
          'Bermain musik dan membaca cerita adalah kegiatan yang bisa dinikmati semua anak tanpa kecuali.',
        glossary: [
          {
            word: 'Irama',
            meaning: 'Ketukan bunyi yang teratur cepat atau lambatnya dalam sebuah lagu.',
          },
        ],
        question: {
          prompt: 'Apa yang membuat konser taman pagi itu terdengar indah?',
          options: [
            'Semua teman bermain bersama mengikuti irama yang kompak',
            'Mereka memutar suara sirene mobil pemadam',
            'Semua anak berteriak tanpa aturan',
          ],
          correctIndex: 0,
          explanation:
            'Tepat! Kekompakan irama dan saling mendengarkan membuat konser kecil mereka merdu sekali.',
        },
        paragraphs: [
          'Pagi itu taman bunga SD Ceria dipenuhi irama ketukan marakas dan nyanyian lagu anak-anak. Mira memberi aba-aba hitungan satu sampai empat sebelum semua teman menggoyangkan botolnya bersama.',
          'Burung gereja di dahan pohon jambu ikut berkicau seolah memberi tepuk tangan. Pak Penjaga Sekolah tersenyum melihat anak-anak bermain akur dan penuh kreativitas.',
          'Ketika bel masuk berbunyi, papan enam titik dan botol marakas disimpan kembali di rak kelas. Esok hari mereka berjanji akan menciptakan lagu baru tentang hujan dan pelangi.',
        ],
      },
    ],
  },
];
