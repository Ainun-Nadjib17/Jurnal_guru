const absensiForm =
    document.getElementById("absensiForm");

const formAbsensiSection =
    document.getElementById("formAbsensiSection");

const formAbsensiTitle =
    document.getElementById("formAbsensiTitle");

const btnTambahSiswa =
    document.getElementById("btnTambahSiswa");

const btnBatalAbsensi =
    document.getElementById("btnBatalAbsensi");

const absensiTableBody =
    document.getElementById("absensiTableBody");

const meetingHeader =
    document.getElementById("meetingHeader");

const jumlahSiswa =
    document.getElementById("jumlahSiswa");


const absensiId =
    document.getElementById("absensiId");

const nis =
    document.getElementById("nis");

const namaSiswa =
    document.getElementById("namaSiswa");


// ========================================
// KONFIGURASI
// ========================================

const TOTAL_PERTEMUAN = 25;


// ========================================
// BUAT HEADER PERTEMUAN
// ========================================

function createMeetingHeader() {

    meetingHeader.innerHTML = "";

    for (
        let i = 1;
        i <= TOTAL_PERTEMUAN;
        i++
    ) {

        const th =
            document.createElement("th");

        th.textContent = i;

        th.className =
            "meeting-column";

        meetingHeader.appendChild(th);
    }
}


// ========================================
// LOAD DATA
// ========================================

async function loadAbsensi() {

    absensiTableBody.innerHTML = `
        <tr>
            <td colspan="29" class="loading">
                Memuat data...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient
            .from("absensi_siswa")
            .select("*")
            .order("nama_siswa", {
                ascending: true
            });


    if (error) {

        console.error(error);

        absensiTableBody.innerHTML = `
            <tr>
                <td colspan="29" class="empty">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

        return;
    }


    renderAbsensi(data);
}


// ========================================
// RENDER
// ========================================

function renderAbsensi(data) {

    jumlahSiswa.textContent =
        `${data.length} siswa`;


    if (data.length === 0) {

        absensiTableBody.innerHTML = `
            <tr>
                <td colspan="29" class="empty">
                    Belum ada data siswa.
                </td>
            </tr>
        `;

        return;
    }


    absensiTableBody.innerHTML =
        data.map((item, index) => {

            const pertemuan =
                item.pertemuan || {};


            let kolomPertemuan = "";


            for (
                let i = 1;
                i <= TOTAL_PERTEMUAN;
                i++
            ) {

                const value =
                    pertemuan[i] || "-";


                kolomPertemuan += `

                    <td class="attendance-cell">

                        <select
                            class="attendance-select"
                            onchange="
                                updateKehadiran(
                                    ${item.id},
                                    ${i},
                                    this.value
                                )
                            "
                        >

                            <option
                                value="-"
                                ${value === "-"
                                    ? "selected"
                                    : ""}
                            >
                                -
                            </option>

                            <option
                                value="H"
                                ${value === "H"
                                    ? "selected"
                                    : ""}
                            >
                                H
                            </option>

                            <option
                                value="S"
                                ${value === "S"
                                    ? "selected"
                                    : ""}
                            >
                                S
                            </option>

                            <option
                                value="I"
                                ${value === "I"
                                    ? "selected"
                                    : ""}
                            >
                                I
                            </option>

                            <option
                                value="A"
                                ${value === "A"
                                    ? "selected"
                                    : ""}
                            >
                                A
                            </option>

                        </select>

                    </td>

                `;
            }


            return `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(item.nis)}
                    </td>

                    <td class="student-name">
                        ${escapeHTML(
                            item.nama_siswa
                        )}
                    </td>

                    ${kolomPertemuan}

                    <td>

                        <div class="action-buttons">

                            <button
                                class="btn-edit"
                                onclick="
                                    editSiswa(${item.id})
                                "
                            >
                                Edit
                            </button>

                            <button
                                class="btn-delete"
                                onclick="
                                    deleteSiswa(${item.id})
                                "
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
// UPDATE KEHADIRAN
// ========================================

async function updateKehadiran(
    id,
    nomorPertemuan,
    status
) {

    const { data, error } =
        await supabaseClient
            .from("absensi_siswa")
            .select("pertemuan")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data absensi."
        );

        return;
    }


    const pertemuan =
        data.pertemuan || {};


    pertemuan[nomorPertemuan] =
        status;


    const { error: updateError } =
        await supabaseClient
            .from("absensi_siswa")
            .update({
                pertemuan: pertemuan
            })
            .eq("id", id);


    if (updateError) {

        console.error(updateError);

        alert(
            "Gagal menyimpan kehadiran: " +
            updateError.message
        );

        return;
    }

}


// ========================================
// TAMBAH SISWA
// ========================================

btnTambahSiswa.addEventListener(
    "click",
    () => {

        resetAbsensiForm();

        formAbsensiTitle.textContent =
            "Tambah Siswa";


        formAbsensiSection
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

btnBatalAbsensi.addEventListener(
    "click",
    () => {

        formAbsensiSection
            .classList
            .add("hidden");

        resetAbsensiForm();

    }
);


// ========================================
// SIMPAN SISWA
// ========================================

absensiForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const id =
            absensiId.value;


        const data = {

            tahun_pelajaran:
                "2026/2027",

            kelas:
                "VIII K",

            nis:
                nis.value.trim(),

            nama_siswa:
                namaSiswa.value.trim()

        };


        let error;


        // UPDATE

        if (id) {

            const response =
                await supabaseClient
                    .from("absensi_siswa")
                    .update(data)
                    .eq("id", id);

            error =
                response.error;

        }


        // INSERT

        else {

            const response =
                await supabaseClient
                    .from("absensi_siswa")
                    .insert([
                        {
                            ...data,
                            pertemuan: {}
                        }
                    ]);

            error =
                response.error;
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
                ? "Data siswa berhasil diperbarui."
                : "Data siswa berhasil ditambahkan."
        );


        formAbsensiSection
            .classList
            .add("hidden");


        resetAbsensiForm();

        loadAbsensi();

    }
);


// ========================================
// EDIT SISWA
// ========================================

async function editSiswa(id) {

    const { data, error } =
        await supabaseClient
            .from("absensi_siswa")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data siswa."
        );

        return;
    }


    absensiId.value =
        data.id;

    nis.value =
        data.nis;

    namaSiswa.value =
        data.nama_siswa;


    formAbsensiTitle.textContent =
        "Edit Siswa";


    formAbsensiSection
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

async function deleteSiswa(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus siswa ini beserta data absensinya?"
        );


    if (!yakin) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("absensi_siswa")
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
        "Data siswa berhasil dihapus."
    );


    loadAbsensi();
}


// ========================================
// RESET
// ========================================

function resetAbsensiForm() {

    absensiForm.reset();

    absensiId.value = "";

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
        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// START
// ========================================

createMeetingHeader();

loadAbsensi();