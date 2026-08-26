const jurnalForm =
    document.getElementById("jurnalForm");

const formJurnalSection =
    document.getElementById("formJurnalSection");

const formJurnalTitle =
    document.getElementById("formJurnalTitle");

const btnTambahJurnal =
    document.getElementById("btnTambahJurnal");

const btnBatalJurnal =
    document.getElementById("btnBatalJurnal");

const jurnalTableBody =
    document.getElementById("jurnalTableBody");

const jumlahJurnal =
    document.getElementById("jumlahJurnal");


// INPUT

const jurnalId =
    document.getElementById("jurnalId");

const hariTanggal =
    document.getElementById("hariTanggal");

const jamKe =
    document.getElementById("jamKe");

const kelas =
    document.getElementById("kelas");

const mapel =
    document.getElementById("mapel");

const jurnalKegiatan =
    document.getElementById("jurnalKegiatan");

const capaianPembelajaran =
    document.getElementById("capaianPembelajaran");

const tujuanPembelajaran =
    document.getElementById("tujuanPembelajaran");

const catatanRefleksi =
    document.getElementById("catatanRefleksi");


// ========================================
// LOAD DATA
// ========================================

async function loadJurnal() {

    jurnalTableBody.innerHTML = `
        <tr>
            <td colspan="10" class="loading">
                Memuat data...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient
            .from("jurnal_kegiatan")
            .select("*")
            .order("hari_tanggal", {
                ascending: false
            });


    if (error) {

        console.error(error);

        jurnalTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

        return;
    }


    renderJurnal(data);
}


// ========================================
// RENDER
// ========================================

function renderJurnal(data) {

    jumlahJurnal.textContent =
        `${data.length} jurnal`;


    if (data.length === 0) {

        jurnalTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty">
                    Belum ada jurnal kegiatan.
                </td>
            </tr>
        `;

        return;
    }


    jurnalTableBody.innerHTML =
        data.map((jurnal, index) => {

            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${formatTanggal(
                            jurnal.hari_tanggal
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.jam_ke
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.kelas
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.mapel
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.jurnal_kegiatan
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.capaian_pembelajaran
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.tujuan_pembelajaran
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            jurnal.catatan_refleksi || "-"
                        )}
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="btn-edit"
                                onclick="editJurnal(${jurnal.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="deleteJurnal(${jurnal.id})"
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
// TAMBAH
// ========================================

btnTambahJurnal.addEventListener(
    "click",
    () => {

        resetJurnalForm();

        formJurnalTitle.textContent =
            "Tambah Jurnal";

        formJurnalSection
            .classList
            .remove("hidden");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// ========================================
// BATAL
// ========================================

btnBatalJurnal.addEventListener(
    "click",
    () => {

        formJurnalSection
            .classList
            .add("hidden");

        resetJurnalForm();

    }
);


// ========================================
// SIMPAN
// ========================================

jurnalForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const id =
            jurnalId.value;


        const data = {

            hari_tanggal:
                hariTanggal.value,

            jam_ke:
                jamKe.value.trim(),

            kelas:
                kelas.value.trim(),

            mapel:
                mapel.value.trim(),

            jurnal_kegiatan:
                jurnalKegiatan.value.trim(),

            capaian_pembelajaran:
                capaianPembelajaran.value.trim(),

            tujuan_pembelajaran:
                tujuanPembelajaran.value.trim(),

            catatan_refleksi:
                catatanRefleksi.value.trim()

        };


        let error;


        // UPDATE

        if (id) {

            const response =
                await supabaseClient
                    .from("jurnal_kegiatan")
                    .update(data)
                    .eq("id", id);

            error = response.error;

        }


        // INSERT

        else {

            const response =
                await supabaseClient
                    .from("jurnal_kegiatan")
                    .insert([data]);

            error = response.error;

        }


        if (error) {

            console.error(error);

            alert(
                "Gagal menyimpan jurnal: " +
                error.message
            );

            return;
        }


        alert(
            id
                ? "Jurnal berhasil diperbarui."
                : "Jurnal berhasil ditambahkan."
        );


        formJurnalSection
            .classList
            .add("hidden");


        resetJurnalForm();

        loadJurnal();

    }
);


// ========================================
// EDIT
// ========================================

async function editJurnal(id) {

    const { data, error } =
        await supabaseClient
            .from("jurnal_kegiatan")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data jurnal."
        );

        return;
    }


    jurnalId.value =
        data.id;

    hariTanggal.value =
        data.hari_tanggal;

    jamKe.value =
        data.jam_ke;

    kelas.value =
        data.kelas;

    mapel.value =
        data.mapel;

    jurnalKegiatan.value =
        data.jurnal_kegiatan;

    capaianPembelajaran.value =
        data.capaian_pembelajaran;

    tujuanPembelajaran.value =
        data.tujuan_pembelajaran;

    catatanRefleksi.value =
        data.catatan_refleksi || "";


    formJurnalTitle.textContent =
        "Edit Jurnal";


    formJurnalSection
        .classList
        .remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ========================================
// DELETE
// ========================================

async function deleteJurnal(id) {

    const yakin = confirm(
        "Yakin ingin menghapus jurnal ini?"
    );


    if (!yakin) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("jurnal_kegiatan")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Gagal menghapus jurnal: " +
            error.message
        );

        return;
    }


    alert(
        "Jurnal berhasil dihapus."
    );


    loadJurnal();
}


// ========================================
// RESET
// ========================================

function resetJurnalForm() {

    jurnalForm.reset();

    jurnalId.value = "";

}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatTanggal(tanggal) {

    if (!tanggal) {
        return "-";
    }


    const date =
        new Date(tanggal + "T00:00:00");


    return date.toLocaleDateString(
        "id-ID",
        {
            weekday: "long",
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
// START
// ========================================

loadJurnal();