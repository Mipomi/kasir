    let kasirGlobal = '';
    let stok12Global = 0;
    let stok10Global = 0;
    let stok12Awal = 0;
    let stok10Awal = 0;
    let stok12Baru = 0;
    let stok10Baru = 0;
    let terjual12 = 0;
    let terjual10 = 0;
    let hasilRingkasan = '';
    let sedangTambahStok = false;


    function simpan(){
      const kasir = document.getElementById('kasir').value.trim();
      if (!kasir || kasir == ''){
        Swal.fire({
          icon: 'warning',
          title: 'Input tidak lengkap',
          text: 'Harap isi nama kasir.'
        });
      }else{
        document.getElementById('nmaKasir').style.display = 'none';
        document.getElementById('stok').style.display = 'block';
        kasirGlobal = kasir;
      }
    }

    function hapusData() {
      const konfirmasi = confirm("Apakah kamu yakin ingin menghapus data?");
      if (konfirmasi) {
        localStorage.removeItem('dataPenjualan');
        location.reload();
      }
    }
    
    function tambahStok() {
      sedangTambahStok = true;
      document.getElementById('stok').style.display = 'block';
      document.getElementById('penjualan').style.display = 'none';

      document.getElementById('stok12').value = '';
      document.getElementById('stok10').value = '';
    }

    function simpanStok() {
      const stok12Input = document.getElementById('stok12').value.trim();
      const stok10Input = document.getElementById('stok10').value.trim();

      if (stok12Input === '' || stok10Input === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Input tidak lengkap',
          text: 'Harap isi jumlah penjualan untuk keduanya.'
        });
        return; // berhenti agar tidak lanjut ke bawah
      }

      const stok12 = parseInt(stok12Input);
      const stok10 = parseInt(stok10Input);

      if (isNaN(stok12) || isNaN(stok10)) {
        Swal.fire({
          icon: 'warning',
          title: 'Input Harus Angka',
          text: 'Inputan Hasur Berupa Angka'
        });
        return;
      }

      if (sedangTambahStok) {
        stok12Baru = stok12;
        stok10Baru = stok10;
        stok12Global += stok12;
        stok10Global += stok10;
      } else {
        stok12Awal = stok12;
        stok10Awal = stok10;
        stok12Global = stok12;
        stok10Global = stok10;
      }

      document.getElementById('stok').style.display = 'none';
      document.getElementById('penjualan').style.display = 'block';
      document.getElementById('infoKasir').innerText = `Kasir: ${kasirGlobal}`;
      updateStokDisplay();
      sedangTambahStok = false;

      simpanKeStorage();
    }

    function updateStokDisplay() {
      document.getElementById('stok12k').innerText = `Stok 12k: ${stok12Global}`;
      document.getElementById('stok10k').innerText = `Stok 10k: ${stok10Global}`;
    }

    function hitungPenjualan() {
      const jual12 = parseInt(document.getElementById('jual12').value || 0);
      const jual10 = parseInt(document.getElementById('jual10').value || 0);

      if (jual12 > stok12Global || jual10 > stok10Global) {
        Swal.fire({
          icon: 'error',
          title: 'Stok tidak cukup',
          text: 'Penjualan melebihi stok tersedia!'
        });
        return;
      }

      stok12Global -= jual12;
      stok10Global -= jual10;

      terjual12 += jual12;
      terjual10 += jual10;

      const total = (terjual12 * 12000) + (terjual10 * 10000);

      hasilRingkasan = 
`Nama Kasir: ${kasirGlobal}
Stok:
- 12rb: ${stok12Awal} + (${stok12Baru})
- 10rb: ${stok10Awal} + (${stok10Baru})

Terjual:
- 12rb: ${terjual12}
- 10rb: ${terjual10}

Sisa Stok:
- 12rb: ${stok12Global}
- 10rb: ${stok10Global}

Total Uang: Rp ${total.toLocaleString('id-ID')}`;

      document.getElementById('hasil').innerText = hasilRingkasan;
      document.getElementById('jual12').value = '';
      document.getElementById('jual10').value = '';

      updateStokDisplay();

      simpanKeStorage();
    }

    function kirimWA() {
      if (!hasilRingkasan) return alert('Hitung dulu sebelum kirim WA!');
      const noWA = '6289654122783'; // Ganti dengan nomor kamu
      const link = `https://wa.me/${noWA}?text=${encodeURIComponent(hasilRingkasan)}`;
      window.open(link, '_blank');
    }

    // Tambahan untuk simpan dan muat dari localStorage
    function simpanKeStorage() {
      const data = {
        kasir: kasirGlobal,
        stok12: stok12Global,
        stok10: stok10Global,
        stok12Awal,
        stok10Awal,
        terjual12,
        terjual10,
        hasilRingkasan,
        waktuSimpan: Date.now()
      };
      localStorage.setItem('dataPenjualan', JSON.stringify(data));
    }

    function muatDariStorage() {
      const data = JSON.parse(localStorage.getItem('dataPenjualan'));
      if (data) {
        const sekarang = Date.now();
        const batasWaktu = 24 * 60 * 60 * 1000;

        if (sekarang - data.waktuSimpan > batasWaktu) {

          localStorage.removeItem('dataPenjualan');
          Swal.fire({
            icon: 'Info',
            title: 'Hapus Data',
            text: 'Data telah di hapus otomatis.'
          });
          return;
        }

        kasirGlobal = data.kasir;
        stok12Global = data.stok12;
        stok10Global = data.stok10;
        stok12Awal = data.stok12Awal;
        stok10Awal = data.stok10Awal;
        terjual12 = data.terjual12;
        terjual10 = data.terjual10;
        hasilRingkasan = data.hasilRingkasan;

        document.getElementById('infoKasir').innerText = `Kasir: ${kasirGlobal}`;
        updateStokDisplay();
        
      }
    }

    window.onload = muatDariStorage;
