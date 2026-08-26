const refleksiForm =
    document.getElementById("refleksiForm");

const formRefleksiSection =
    document.getElementById("formRefleksiSection");

const formRefleksiTitle =
    document.getElementById("formRefleksiTitle");

const btnTambahRefleksi =
    document.getElementById("btnTambahRefleksi");

const btnBatalRefleksi =
    document.getElementById("btnBatalRefleksi");

const refleksiTableBody =
    document.getElementById("refleksiTableBody");

const jumlahRefleksi =
    document.getElementById("jumlahRefleksi");


// INPUT

const refleksiId =
    document.getElementById("refleksiId");

const kelas =
    document.getElementById("kelas");

const mapel =
    document.getElementById("mapel");

const no =
    document.getElementById("no");

const tanggal =
    document.getElementById("tanggal");

const cp =
    document.getElementById("cp");

const tp =
    document.getElementById("tp");

const modelMetode =
    document.getElementById("modelMetode");

const catatanRefleksi =
    document.getElementById("catatanRefleksi");

const semester =
    document.getElementById("semester");

const tahunPelajaran =
    document.getElementById("tahunPelajaran");

const rencanaTindakLanjut =
    document.getElementById(
        "rencanaTindakLanjut"
    );


// ========================================
// LOAD DATA
// ========================================

async function loadRefleksi() {

    refleksiTableBody.innerHTML = `
        <tr>
            <td colspan="12" class="loading">
                Memuat data...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient
            .from("refleksi_mengajar")
            .select("*")
            .order("tanggal", {
                ascending: false
            });


    if (error) {

        console.error(error);

        refleksiTableBody.innerHTML = `
            <tr>
                <td colspan="12" class="empty">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

        return;
    }


    renderRefleksi(data);
}


// ========================================
// RENDER
// ========================================

function renderRefleksi(data) {

    jumlahRefleksi.textContent =
        `${data.length} data`;


    if (data.length === 0) {

        refleksiTableBody.innerHTML = `
            <tr>
                <td colspan="12" class="empty">
                    Belum ada data refleksi.
                </td>
            </tr>
        `;

        return;
    }


    refleksiTableBody.innerHTML =
        data.map((item) => {

            return `

                <tr>

                    <td>
                        ${item.no}
                    </td>

                    <td>
                        ${escapeHTML(item.kelas)}
                    </td>

                    <td>
                        ${escapeHTML(item.mapel)}
                    </td>

                    <td>
                        ${formatTanggal(item.tanggal)}
                    </td>

                    <td>
                        ${escapeHTML(item.cp)}
                    </td>

                    <td>
                        ${escapeHTML(item.tp)}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.model_metode
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.catatan_refleksi
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
                            item.rencana_tindak_lanjut
                        )}
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="btn-edit"
                                onclick="editRefleksi(${item.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="deleteRefleksi(${item.id})"
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

btnTambahRefleksi.addEventListener(
    "click",
    () => {

        resetRefleksiForm();

        formRefleksiTitle.textContent =
            "Tambah Refleksi Mengajar";


        formRefleksiSection
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

btnBatalRefleksi.addEventListener(
    "click",
    () => {

        formRefleksiSection
            .classList
            .add("hidden");

        resetRefleksiForm();

    }
);


// ========================================
// SIMPAN
// ========================================

refleksiForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const id =
            refleksiId.value;


        const data = {

            kelas:
                kelas.value.trim(),

            mapel:
                mapel.value.trim(),

            no:
                Number(no.value),

            tanggal:
                tanggal.value,

            cp:
                cp.value.trim(),

            tp:
                tp.value.trim(),

            model_metode:
                modelMetode.value.trim(),

            catatan_refleksi:
                catatanRefleksi.value.trim(),

            semester:
                semester.value,

            tahun_pelajaran:
                tahunPelajaran.value.trim(),

            rencana_tindak_lanjut:
                rencanaTindakLanjut.value.trim()

        };


        let error;


        // UPDATE

        if (id) {

            const response =
                await supabaseClient
                    .from("refleksi_mengajar")
                    .update(data)
                    .eq("id", id);

            error = response.error;

        }


        // INSERT

        else {

            const response =
                await supabaseClient
                    .from("refleksi_mengajar")
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
                ? "Refleksi berhasil diperbarui."
                : "Refleksi berhasil ditambahkan."
        );


        formRefleksiSection
            .classList
            .add("hidden");


        resetRefleksiForm();

        loadRefleksi();

    }
);


// ========================================
// EDIT
// ========================================

async function editRefleksi(id) {

    const { data, error } =
        await supabaseClient
            .from("refleksi_mengajar")
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


    refleksiId.value =
        data.id;

    kelas.value =
        data.kelas;

    mapel.value =
        data.mapel;

    no.value =
        data.no;

    tanggal.value =
        data.tanggal;

    cp.value =
        data.cp;

    tp.value =
        data.tp;

    modelMetode.value =
        data.model_metode;

    catatanRefleksi.value =
        data.catatan_refleksi;

    semester.value =
        data.semester;

    tahunPelajaran.value =
        data.tahun_pelajaran;

    rencanaTindakLanjut.value =
        data.rencana_tindak_lanjut;


    formRefleksiTitle.textContent =
        "Edit Refleksi Mengajar";


    formRefleksiSection
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

async function deleteRefleksi(id) {

    const yakin = confirm(
        "Yakin ingin menghapus refleksi ini?"
    );


    if (!yakin) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("refleksi_mengajar")
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
        "Refleksi berhasil dihapus."
    );


    loadRefleksi();
}


// ========================================
// RESET FORM
// ========================================

function resetRefleksiForm() {

    refleksiForm.reset();

    refleksiId.value = "";

    tahunPelajaran.value =
        "2026/2027";

}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatTanggal(tanggal) {

    if (!tanggal) {
        return "-";
    }


    const date =
        new Date(
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
// START
// ========================================

loadRefleksi();