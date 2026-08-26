const sikapForm =
    document.getElementById("sikapForm");

const formSikapSection =
    document.getElementById("formSikapSection");

const formSikapTitle =
    document.getElementById("formSikapTitle");

const btnTambahSikap =
    document.getElementById("btnTambahSikap");

const btnBatalSikap =
    document.getElementById("btnBatalSikap");

const sikapTableBody =
    document.getElementById("sikapTableBody");

const jumlahSikap =
    document.getElementById("jumlahSikap");


// INPUT

const sikapId =
    document.getElementById("sikapId");

const no =
    document.getElementById("no");

const mapel =
    document.getElementById("mapel");

const tanggal =
    document.getElementById("tanggal");

const namaSiswa =
    document.getElementById("namaSiswa");

const catatanSikapPerilaku =
    document.getElementById(
        "catatanSikapPerilaku"
    );

const semester =
    document.getElementById("semester");

const tahunPelajaran =
    document.getElementById(
        "tahunPelajaran"
    );

const tindakanGuru =
    document.getElementById("tindakanGuru");

const ttdSiswa =
    document.getElementById("ttdSiswa");


// ========================================
// LOAD DATA
// ========================================

async function loadSikap() {

    sikapTableBody.innerHTML = `
        <tr>
            <td colspan="10" class="loading">
                Memuat data...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient
            .from("catatan_sikap")
            .select("*")
            .order("tanggal", {
                ascending: false
            });


    if (error) {

        console.error(error);

        sikapTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

        return;
    }


    renderSikap(data);
}


// ========================================
// RENDER
// ========================================

function renderSikap(data) {

    jumlahSikap.textContent =
        `${data.length} catatan`;


    if (data.length === 0) {

        sikapTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty">
                    Belum ada catatan sikap.
                </td>
            </tr>
        `;

        return;
    }


    sikapTableBody.innerHTML =
        data.map((item) => {

            return `

                <tr>

                    <td>
                        ${item.no}
                    </td>

                    <td>
                        ${escapeHTML(item.mapel)}
                    </td>

                    <td>
                        ${formatTanggal(
                            item.tanggal
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.nama_siswa
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.catatan_sikap_perilaku
                        )}
                    </td>

                    <td>
                        Semester ${item.semester}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.tahun_pelajaran
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.tindakan_guru
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.ttd_siswa || "-"
                        )}
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="btn-edit"
                                onclick="editSikap(${item.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="deleteSikap(${item.id})"
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

btnTambahSikap.addEventListener(
    "click",
    () => {

        resetSikapForm();

        formSikapTitle.textContent =
            "Tambah Catatan";


        formSikapSection
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

btnBatalSikap.addEventListener(
    "click",
    () => {

        formSikapSection
            .classList
            .add("hidden");


        resetSikapForm();

    }
);


// ========================================
// SIMPAN
// ========================================

sikapForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const id =
            sikapId.value;


        const data = {

            no:
                Number(no.value),

            mapel:
                mapel.value.trim(),

            tanggal:
                tanggal.value,

            nama_siswa:
                namaSiswa.value.trim(),

            catatan_sikap_perilaku:
                catatanSikapPerilaku.value.trim(),

            semester:
                semester.value,

            tahun_pelajaran:
                tahunPelajaran.value.trim(),

            tindakan_guru:
                tindakanGuru.value.trim(),

            ttd_siswa:
                ttdSiswa.value.trim()

        };


        let error;


        // UPDATE

        if (id) {

            const response =
                await supabaseClient
                    .from("catatan_sikap")
                    .update(data)
                    .eq("id", id);

            error = response.error;

        }


        // INSERT

        else {

            const response =
                await supabaseClient
                    .from("catatan_sikap")
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
                ? "Catatan berhasil diperbarui."
                : "Catatan berhasil ditambahkan."
        );


        formSikapSection
            .classList
            .add("hidden");


        resetSikapForm();

        loadSikap();

    }
);


// ========================================
// EDIT
// ========================================

async function editSikap(id) {

    const { data, error } =
        await supabaseClient
            .from("catatan_sikap")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data."
        );

        return;
    }


    sikapId.value =
        data.id;

    no.value =
        data.no;

    mapel.value =
        data.mapel;

    tanggal.value =
        data.tanggal;

    namaSiswa.value =
        data.nama_siswa;

    catatanSikapPerilaku.value =
        data.catatan_sikap_perilaku;

    semester.value =
        data.semester;

    tahunPelajaran.value =
        data.tahun_pelajaran;

    tindakanGuru.value =
        data.tindakan_guru;

    ttdSiswa.value =
        data.ttd_siswa || "";


    formSikapTitle.textContent =
        "Edit Catatan";


    formSikapSection
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

async function deleteSikap(id) {

    const yakin = confirm(
        "Yakin ingin menghapus catatan ini?"
    );


    if (!yakin) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("catatan_sikap")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Gagal menghapus data: " +
            error.message
        );

        return;
    }


    alert(
        "Catatan berhasil dihapus."
    );


    loadSikap();
}


// ========================================
// RESET
// ========================================

function resetSikapForm() {

    sikapForm.reset();

    sikapId.value = "";

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

loadSikap();