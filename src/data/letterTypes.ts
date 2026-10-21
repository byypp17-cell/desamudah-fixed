import { LetterType } from '../types';

export const LETTER_TYPES: LetterType[] = [
  {
    id: 'sk-domisili',
    code: 'SKD',
    name: 'Surat Keterangan Domisili',
    category: 'Kependudukan',
    description: 'Surat keterangan resmi yang menerangkan bahwa warga benar bertempat tinggal/menetap di wilayah desa ini untuk keperluan administrasi, pekerjaan, perbankan, atau sekolah.',
    estimatedDays: '1 Hari Kerja',
    icon: 'Home',
    legalBasis: 'Permendagri No. 474/479/SJ tentang Pedoman Administrasi Kependudukan',
    requirements: [
      {
        id: 'req-ktp',
        name: 'KTP Asli / e-KTP Pemohon',
        description: 'Foto/Scan e-KTP jelas, terbaca, tidak blur, dan tidak terpotong',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga (KK)',
        description: 'Scan atau foto Kartu Keluarga terbaru yang memuat nama pemohon',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Surat pengantar asli bertandatangan Ketua RT & RW setempat',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-bukti-tinggal',
        name: 'Bukti Tempat Tinggal / Sewa',
        description: 'PBB terakhir, sertifikat, atau perjanjian sewa / kontrak (opsional untuk domisili non-permanen)',
        required: false,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'lamaMenetap',
        label: 'Lama Menetap di Alamat Ini',
        placeholder: 'Contoh: 3 Tahun 6 Bulan',
        type: 'text',
        required: true,
      },
      {
        id: 'statusTempatTinggal',
        label: 'Status Tempat Tinggal',
        placeholder: 'Pilih status tempat tinggal',
        type: 'select',
        options: ['Milik Sendiri', 'Milik Orang Tua/Keluarga', 'Sewa / Kontrak', 'Asrama / Kos'],
        required: true,
      }
    ]
  },
  {
    id: 'sk-usaha',
    code: 'SKU',
    name: 'Surat Keterangan Usaha (SKU)',
    category: 'Usaha & Ekonomi',
    description: 'Surat keterangan resmi bahwa warga memiliki kegiatan usaha aktif di wilayah desa untuk pengajuan permodalan (KUR/Bank), legalitas UMKM, atau izin usaha.',
    estimatedDays: '1-2 Hari Kerja',
    icon: 'Briefcase',
    legalBasis: 'UU No. 20 Tahun 2008 tentang Usaha Mikro, Kecil, dan Menengah (UMKM)',
    requirements: [
      {
        id: 'req-ktp',
        name: 'KTP Pemohon / Pemilik Usaha',
        description: 'Foto e-KTP pemilik usaha yang masih berlaku',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga (KK)',
        description: 'Foto KK pemilik usaha',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Menerangkan bahwa usaha benar berada di lingkungan RT/RW terkait',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-foto-usaha',
        name: 'Foto Tempat / Kegiatan Usaha',
        description: 'Foto tempat usaha dari depan memperlihatkan papan nama/aktivitas usaha',
        required: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'namaUsaha',
        label: 'Nama Usaha / Toko / Bengkel',
        placeholder: 'Contoh: Berkah Mandiri Frozen Food',
        type: 'text',
        required: true,
      },
      {
        id: 'bidangUsaha',
        label: 'Bidang / Jenis Usaha',
        placeholder: 'Pilih bidang usaha',
        type: 'select',
        options: ['Perdagangan / Toko Kelontong', 'Kuliner / Makanan & Minuman', 'Jasa & Bengkel', 'Pertanian & Peternakan', 'Kerajinan / Industri Rumahan', 'Teknologi & Digital'],
        required: true,
      },
      {
        id: 'alamatUsaha',
        label: 'Alamat Lokasi Usaha',
        placeholder: 'Jalan, RT/RW, Dusun tempat usaha beroperasi',
        type: 'text',
        required: true,
      },
      {
        id: 'lamaBerdiri',
        label: 'Lama Usaha Berjalan',
        placeholder: 'Contoh: 2 Tahun',
        type: 'text',
        required: true,
      }
    ]
  },
  {
    id: 'sk-pengantar',
    code: 'SKP',
    name: 'Surat Pengantar (SKCK / Umum)',
    category: 'Umum',
    description: 'Surat pengantar dari kepala desa untuk pengurusan SKCK ke Polsek/Polres, melamar pekerjaan BUMN/Swasta, atau pengurusan berkas dinas lainnya.',
    estimatedDays: '1 Hari Kerja',
    icon: 'FileText',
    legalBasis: 'Peraturan Kapolri No. 18 Tahun 2014 tentang Penerbitan SKCK',
    requirements: [
      {
        id: 'req-ktp',
        name: 'KTP Pemohon',
        description: 'Scan/Foto e-KTP pemohon',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga',
        description: 'Scan/Foto KK pemohon',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Surat pengantar RT/RW setempat',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pasfoto',
        name: 'Pasfoto 4x6 Latar Belakang Merah',
        description: 'Foto formal berpakaian sopan dengan latar merah',
        required: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'tujuanPengantar',
        label: 'Tujuan Pengantar / Instansi Tujuan',
        placeholder: 'Pilih tujuan pengantar',
        type: 'select',
        options: ['Pembuatan SKCK di Polsek / Polres', 'Melamar Pekerjaan (BUMN/PNS/Swasta)', 'Pendaftaran Sekolah / Perguruan Tinggi', 'Pengurusan Paspor / Visa', 'Pengurusan Berkas Instansi Lainnya'],
        required: true,
      }
    ]
  },
  {
    id: 'sk-tidak-mampu',
    code: 'SKTM',
    name: 'Surat Keterangan Tidak Mampu (SKTM)',
    category: 'Kesejahteraan',
    description: 'Surat keterangan keadaan ekonomi keluarga kurang mampu untuk pengajuan beasiswa pendidikan (KIP-Kuliah), keringanan biaya rumah sakit, atau bantuan sosial.',
    estimatedDays: '1-2 Hari Kerja',
    icon: 'HeartHandshake',
    legalBasis: 'Kemensos RI tentang Kriteria dan Verifikasi Fakir Miskin',
    requirements: [
      {
        id: 'req-ktp',
        name: 'KTP Kepala Keluarga & Pemohon',
        description: 'Foto e-KTP kepala keluarga dan siswa/mahasiswa pemohon',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga (KK)',
        description: 'Foto KK jelas memuat seluruh anggota keluarga',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Surat pengantar RT/RW menyatakan kondisi ekonomi keluarga',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-foto-rumah',
        name: 'Foto Rumah Tampak Depan & Dalam',
        description: 'Foto kondisi tempat tinggal tampak depan dan ruang utama',
        required: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pernyataan-penghasilan',
        name: 'Surat Pernyataan Penghasilan Bermaterai',
        description: 'Surat pernyataan total pendapatan keluarga diketahui RT/RW',
        required: false,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'namaSiswa',
        label: 'Nama Anak / Siswa / Pasien yang Diajukan',
        placeholder: 'Tulis nama lengkap jika berbeda dari pemohon',
        type: 'text',
        required: true,
      },
      {
        id: 'tujuanSktm',
        label: 'Penggunaan SKTM',
        placeholder: 'Pilih peruntukan SKTM',
        type: 'select',
        options: ['Pengajuan Beasiswa / KIP Kuliah', 'Keringanan Biaya Rumah Sakit / Berobat', 'Pendaftaran Sekolah / PPDB Jalur Afirmasi', 'Pengajuan Bantuan Sosial / PKH', 'Keringanan Biaya Pengadilan'],
        required: true,
      },
      {
        id: 'estimasiPenghasilan',
        label: 'Estimasi Penghasilan Rata-rata Keluarga per Bulan',
        placeholder: 'Contoh: Rp 800.000 / bulan',
        type: 'text',
        required: true,
      }
    ]
  },
  {
    id: 'sk-kelahiran',
    code: 'SKL',
    name: 'Surat Keterangan Kelahiran',
    category: 'Catatan Sipil',
    description: 'Surat keterangan resmi dari desa atas kelahiran bayi baru lahir untuk dasar penerbitan Akta Kelahiran dan pembaruan Kartu Keluarga di Disdukcapil.',
    estimatedDays: '1-2 Hari Kerja',
    icon: 'Baby',
    legalBasis: 'UU No. 24 Tahun 2013 tentang Administrasi Kependudukan',
    requirements: [
      {
        id: 'req-surat-bidan',
        name: 'Surat Kelahiran dari Bidan / Rumah Sakit / Puskesmas',
        description: 'Surat kenal lahir asli dari tenaga medis penolong persalinan',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-ktp-ortu',
        name: 'KTP Ayah & Ibu Kandung',
        description: 'Foto/Scan e-KTP kedua orang tua',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga Orang Tua',
        description: 'Scan Kartu Keluarga orang tua saat ini',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-buku-nikah',
        name: 'Buku Nikah / Akta Perkawinan Orang Tua',
        description: 'Foto lembar identitas dan pengesahan buku nikah',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'namaBayi',
        label: 'Nama Lengkap Bayi / Anak',
        placeholder: 'Nama lengkap bayi yang dilahirkan',
        type: 'text',
        required: true,
      },
      {
        id: 'jenisKelaminBayi',
        label: 'Jenis Kelamin Bayi',
        placeholder: 'Pilih jenis kelamin',
        type: 'select',
        options: ['Laki-laki', 'Perempuan'],
        required: true,
      },
      {
        id: 'ttlBayi',
        label: 'Tempat, Tanggal & Pukul Kelahiran',
        placeholder: 'Contoh: Bandung, 14 Oktober 2025 pukul 04:30 WIB',
        type: 'text',
        required: true,
      },
      {
        id: 'anakKe',
        label: 'Kelahiran Anak Ke-',
        placeholder: 'Contoh: 2 (Dua)',
        type: 'text',
        required: true,
      }
    ]
  },
  {
    id: 'sk-kematian',
    code: 'SKM',
    name: 'Surat Keterangan Kematian',
    category: 'Catatan Sipil',
    description: 'Surat keterangan resmi atas meninggalnya warga desa untuk pengurusan Akta Kematian, penghapusan data kependudukan, asuransi, perbankan, dan warisan.',
    estimatedDays: '1 Hari Kerja',
    icon: 'ShieldAlert',
    legalBasis: 'Permendagri No. 108 Tahun 2019 tentang Pelaksanaan Perpres No. 96 Tahun 2018',
    requirements: [
      {
        id: 'req-surat-medis',
        name: 'Surat Kematian Medis / RS / Puskesmas',
        description: 'Surat kematian dari dokter jika meninggal di fasilitas kesehatan, atau surat pernyataan saksi',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-ktp-almarhum',
        name: 'KTP & KK Almarhum / Almarhumah',
        description: 'Foto/Scan e-KTP dan KK jenazah',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-ktp-pelapor',
        name: 'KTP Pelapor (Ahli Waris / Keluarga)',
        description: 'Foto e-KTP pelapor yang masih berstatus keluarga sedarah/ahli waris',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Surat pengantar RT/RW menyatakan kebenaran wafatnya almarhum/ah',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'namaAlmarhum',
        label: 'Nama Lengkap Almarhum / Almarhumah',
        placeholder: 'Nama lengkap beserta gelar (jika ada)',
        type: 'text',
        required: true,
      },
      {
        id: 'nikAlmarhum',
        label: 'NIK Almarhum / Almarhumah',
        placeholder: '16 digit NIK almarhum',
        type: 'text',
        required: true,
      },
      {
        id: 'waktuMeninggal',
        label: 'Hari, Tanggal & Pukul Meninggal',
        placeholder: 'Contoh: Senin, 10 Oktober 2025 pukul 19:45 WIB',
        type: 'text',
        required: true,
      },
      {
        id: 'tempatMeninggal',
        label: 'Tempat Meninggal & Penyebab',
        placeholder: 'Contoh: Di Rumah (Sakit Tua) / RSUD Cibabat (Serangan Jantung)',
        type: 'text',
        required: true,
      },
      {
        id: 'hubunganPelapor',
        label: 'Hubungan Pelapor dengan Almarhum',
        placeholder: 'Pilih hubungan pelapor',
        type: 'select',
        options: ['Anak Kandung', 'Suami / Istri', 'Orang Tua Kandung', 'Saudara Kandung', 'Keluarga Lainnya'],
        required: true,
      }
    ]
  },
  {
    id: 'sk-pindah',
    code: 'SKPWNI',
    name: 'Surat Keterangan Pindah (SKPWNI)',
    category: 'Kependudukan',
    description: 'Surat pengantar perpindahan penduduk dari desa asal ke desa/kelurahan tujuan (antar desa, antar kecamatan, kabupaten, atau provinsi).',
    estimatedDays: '2-3 Hari Kerja',
    icon: 'Truck',
    legalBasis: 'Perpres No. 96 Tahun 2018 tentang Persyaratan Pendaftaran Kependudukan',
    requirements: [
      {
        id: 'req-kk-asli',
        name: 'Kartu Keluarga (KK) Asli',
        description: 'Foto/Scan KK asli yang akan dicabut/diperbarui',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-ktp-pindah',
        name: 'KTP Seluruh Anggota Keluarga yang Pindah',
        description: 'KTP semua anggota keluarga yang ikut pindah domisili',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW Pindah',
        description: 'Surat pengantar pelepasan warga dari RT dan RW setempat',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pasfoto',
        name: 'Pasfoto Pemohon (3x4)',
        description: 'Pasfoto terbaru kepala keluarga/pemohon',
        required: true,
        acceptedFormats: ['JPG', 'PNG'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'alamatTujuan',
        label: 'Alamat Lengkap Tempat Tujuan Pindah',
        placeholder: 'Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi',
        type: 'textarea',
        required: true,
      },
      {
        id: 'alasanPindah',
        label: 'Alasan Kepindahan',
        placeholder: 'Pilih alasan pindah',
        type: 'select',
        options: ['Pekerjaan / Mutasi Dinas', 'Pendidikan / Sekolah', 'Keluarga / Menikah', 'Perumahan / Rumah Baru', 'Lainnya'],
        required: true,
      },
      {
        id: 'jumlahKeluargaPindah',
        label: 'Jumlah Anggota Keluarga yang Pindah',
        placeholder: 'Contoh: 3 Orang (Kepala Keluarga, Istri, 1 Anak)',
        type: 'text',
        required: true,
      }
    ]
  },
  {
    id: 'sk-belum-nikah',
    code: 'SKBN',
    name: 'Surat Keterangan Belum Menikah',
    category: 'Kependudukan',
    description: 'Surat keterangan resmi yang menyatakan bahwa pemohon berstatus lajang/belum pernah menikah untuk keperluan lamaran kerja, tes CPNS/TNI/Polri, KUA, atau KPR Bank.',
    estimatedDays: '1 Hari Kerja',
    icon: 'UserCheck',
    legalBasis: 'Kompilasi Hukum Islam & UU No. 1 Tahun 1974 tentang Perkawinan',
    requirements: [
      {
        id: 'req-ktp',
        name: 'KTP Pemohon',
        description: 'Foto/Scan e-KTP pemohon yang masih berlaku',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-kk',
        name: 'Kartu Keluarga Pemohon',
        description: 'Foto Kartu Keluarga memuat nama pemohon berstatus Belum Kawin',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-pengantar-rt',
        name: 'Surat Pengantar RT / RW',
        description: 'Surat pengantar menyatakan pemohon belum pernah menikah',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      },
      {
        id: 'req-surat-pernyataan',
        name: 'Surat Pernyataan Belum Menikah (Bermaterai Rp 10.000)',
        description: 'Surat pernyataan bermaterai yang ditandatangani pemohon dan 2 saksi',
        required: true,
        acceptedFormats: ['JPG', 'PNG', 'PDF'],
        maxSizeMB: 5,
      }
    ],
    extraFields: [
      {
        id: 'tujuanPenggunaan',
        label: 'Keperluan Pembuatan Surat',
        placeholder: 'Pilih peruntukan surat belum menikah',
        type: 'select',
        options: ['Persyaratan Pendaftaran Pernikahan ke KUA / Catatan Sipil', 'Persyaratan Pendaftaran CPNS / BUMN / Kedinasan', 'Pendaftaran Masuk TNI / POLRI', 'Pengajuan Kredit Rumah (KPR Bank) Non-Pasangan', 'Persyaratan Beasiswa Luar Negeri'],
        required: true,
      }
    ]
  }
];
