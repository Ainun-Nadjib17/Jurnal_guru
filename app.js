const form = document.getElementById("tugasForm");
const formSection = document.getElementById("formSection");
const formTitle = document.getElementById("formTitle");

const btnTambah = document.getElementById("btnTambah");
const btnBatal = document.getElementById("btnBatal");

const tableBody = document.getElementById("tugasTableBody");
const jumlahTugas = document.getElementById("jumlahTugas");

const tugasId = document.getElementById("tugasId");
const no = document.getElementById("no");
const tp = document.getElementById("tp");
const bentukTugas = document.getElementById("bentukTugas");
const sifatPengerjaan = document.getElementById("sifatPengerjaan");
const tempatPengerjaan = document.getElementById("tempatPengerjaan");
const tanggalMulai = document.getElementById("tanggalMulai");
const pukulMulai = document.getElementById("pukulMulai");
const tanggalSelesai = document.getElementById("tanggalSelesai");
const pukulSelesai = document.getElementById("pukulSelesai");


// ========================================
// LOAD DATA
// ========================================

async function loadTugas() {

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                Memuat data...
            </td>
        </tr>
    `;

    const { data, error } = await supabaseClient
        .from("tugas")
        .select("*")
        .order("no", {
            ascending: true
        });

    if (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

        return;
    }

    renderTugas(data);
}


// ========================================
// RENDER DATA
// ========================================

function renderTugas(data) {

    jumlahTugas.textContent = `${data.length} tugas`;

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Belum ada tugas.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = data.map(tugas => {

        const sifatClass =
            tugas.sifat_pengerjaan === "Mandiri"
                ? "badge-mandiri"
                : "badge-kelompok";

        const tempatClass =
            tugas.tempat_pengerjaan === "Dalam Kelas"
                ? "badge-dalam"
                : "badge-luar";

        return `
            <tr>

                <td>${tugas.no}</td>

                <td>${escapeHTML(tugas.tp)}</td>

                <td>
                    ${escapeHTML(tugas.bentuk_tugas)}
                </td>

                <td>
                    <span class="badge ${sifatClass}">
                        ${tugas.sifat_pengerjaan}
                    </span>
                </td>

                <td>
                    <span class="badge ${tempatClass}">
                        ${tugas.tempat_pengerjaan}
                    </span>
                </td>

                <td>
                    ${formatTanggal(tugas.tanggal_mulai)}
                    <br>
                    ${tugas.pukul_mulai}
                </td>

                <td>
                    ${formatTanggal(tugas.tanggal_selesai)}
                    <br>
                    ${tugas.pukul_selesai}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-edit"
                            onclick="editTugas(${tugas.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="btn-delete"
                            onclick="deleteTugas(${tugas.id})"
                        >
                            Hapus
                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}


// ========================================
// TAMBAH TUGAS
// ========================================

btnTambah.addEventListener("click", () => {

    resetForm();

    formTitle.textContent = "Tambah Tugas";

    formSection.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ========================================
// BATAL
// ========================================

btnBatal.addEventListener("click", () => {

    formSection.classList.add("hidden");

    resetForm();

});


// ========================================
// SUBMIT FORM
// ========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const id = tugasId.value;

    const data = {

        no: Number(no.value),

        tp: tp.value.trim(),

        bentuk_tugas: bentukTugas.value.trim(),

        sifat_pengerjaan:
            sifatPengerjaan.value,

        tempat_pengerjaan:
            tempatPengerjaan.value,

        tanggal_mulai:
            tanggalMulai.value,

        pukul_mulai:
            pukulMulai.value,

        tanggal_selesai:
            tanggalSelesai.value,

        pukul_selesai:
            pukulSelesai.value

    };


    // Validasi tanggal

    if (
        new Date(`${data.tanggal_selesai}T${data.pukul_selesai}`)
        <
        new Date(`${data.tanggal_mulai}T${data.pukul_mulai}`)
    ) {

        alert(
            "Waktu selesai tidak boleh lebih awal dari waktu mulai."
        );

        return;
    }


    let error;


    // UPDATE

    if (id) {

        const response = await supabaseClient
            .from("tugas")
            .update(data)
            .eq("id", id);

        error = response.error;

    }


    // CREATE

    else {

        const response = await supabaseClient
            .from("tugas")
            .insert([data]);

        error = response.error;

    }


    if (error) {

        console.error(error);

        alert(
            "Gagal menyimpan data: " +
            error.message
        );

        return;
    }


    alert(
        id
            ? "Tugas berhasil diperbarui."
            : "Tugas berhasil ditambahkan."
    );


    formSection.classList.add("hidden");

    resetForm();

    loadTugas();

});


// ========================================
// EDIT TUGAS
// ========================================

async function editTugas(id) {

    const { data, error } = await supabaseClient
        .from("tugas")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        console.error(error);

        alert("Gagal mengambil data tugas.");

        return;
    }


    tugasId.value = data.id;

    no.value = data.no;

    tp.value = data.tp;

    bentukTugas.value =
        data.bentuk_tugas;

    sifatPengerjaan.value =
        data.sifat_pengerjaan;

    tempatPengerjaan.value =
        data.tempat_pengerjaan;

    tanggalMulai.value =
        data.tanggal_mulai;

    pukulMulai.value =
        data.pukul_mulai;

    tanggalSelesai.value =
        data.tanggal_selesai;

    pukulSelesai.value =
        data.pukul_selesai;


    formTitle.textContent =
        "Edit Tugas";


    formSection.classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// DELETE TUGAS
// ========================================

async function deleteTugas(id) {

    const yakin = confirm(
        "Yakin ingin menghapus tugas ini?"
    );

    if (!yakin) {
        return;
    }


    const { error } = await supabaseClient
        .from("tugas")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Gagal menghapus tugas: " +
            error.message
        );

        return;
    }


    alert(
        "Tugas berhasil dihapus."
    );


    loadTugas();

}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    form.reset();

    tugasId.value = "";

}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatTanggal(tanggal) {

    if (!tanggal) {
        return "-";
    }

    const date = new Date(
        tanggal + "T00:00:00"
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    if (!text) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// START APP
// ========================================

loadTugas();