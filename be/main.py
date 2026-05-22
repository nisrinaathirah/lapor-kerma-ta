from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "nan27"),
        port=os.getenv("DB_PORT", "5432")
    )

@app.get("/api/statistik")
def get_statistik():
    conn = get_db_connection()
    cur = conn.cursor()
    
    
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "nan27"),
        port=os.getenv("DB_PORT", "5432")
    )

@app.get("/api/statistik")
def get_statistik():
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # === 1. TOTAL MoU, MoA, IA (opsional, tapi bagus untuk ditampilkan) ===
        cur.execute("""
            SELECT 
                COUNT(*) FILTER (WHERE bentuk_kerjasama = 'MoU') AS total_mou,
                COUNT(*) FILTER (WHERE bentuk_kerjasama = 'MoA') AS total_moa,
                COUNT(*) FILTER (WHERE bentuk_kerjasama = 'IA') AS total_ia
            FROM kerjasama;
        """)
        total_row = cur.fetchone()
        total_mou = total_row[0] or 0
        total_moa = total_row[1] or 0
        total_ia = total_row[2] or 0

        # === 2. MARKERS: Negara + jumlah per jenis ===
        cur.execute("""
            SELECT 
                n.id,
                n.nama_negara AS name,
                n.latitude AS lat,
                n.longitude AS lng,
                COUNT(CASE WHEN k.bentuk_kerjasama = 'MoA' THEN 1 END) AS moa,
                COUNT(CASE WHEN k.bentuk_kerjasama = 'MoU' THEN 1 END) AS mou,
                COUNT(CASE WHEN k.bentuk_kerjasama = 'IA' THEN 1 END) AS ia
            FROM negara n
            LEFT JOIN kerjasama k ON n.id = k.id_negara
            GROUP BY n.id, n.nama_negara, n.latitude, n.longitude
            ORDER BY n.nama_negara;
        """)
        markers = []
        for row in cur.fetchall():
            markers.append({
                "id": row[0],
                "name": row[1],
                "lat": float(row[2]) if row[2] is not None else 0.0,
                "lng": float(row[3]) if row[3] is not None else 0.0,
                "moa": row[4] or 0,
                "mou": row[5] or 0,
                "ia": row[6] or 0
            })

        # === 3. YEARLY DATA: 2019–2024 ===
        years = ["2019", "2020", "2021", "2022", "2023", "2024"]
        yearly_data = {year: {"mou": 0, "moa": 0, "ia": 0} for year in years}

        cur.execute("""
            SELECT 
                EXTRACT(YEAR FROM tanggal_mulai)::TEXT AS year,
                bentuk_kerjasama,
                COUNT(*) AS count
            FROM kerjasama
            WHERE tanggal_mulai IS NOT NULL
              AND EXTRACT(YEAR FROM tanggal_mulai) BETWEEN 2019 AND 2024
            GROUP BY year, bentuk_kerjasama;
        """)
        for row in cur.fetchall():
            year, jenis, count = row[0], row[1], row[2]
            if year in yearly_data:
                if jenis == "MoU":
                    yearly_data[year]["mou"] = count
                elif jenis == "MoA":
                    yearly_data[year]["moa"] = count
                elif jenis == "IA":
                    yearly_data[year]["ia"] = count

        MoU = [yearly_data[y]["mou"] for y in years]
        MoA = [yearly_data[y]["moa"] for y in years]
        IA = [yearly_data[y]["ia"] for y in years]

        # === 4. TOP 10 INCOME GENERATE ===
        cur.execute("""
            SELECT 
                m.nama_mitra AS instansi,
                SUM(k.jumlah_income) AS total_income
            FROM kerjasama k
            JOIN mitra m ON k.id_mitra = m.id
            WHERE k.jumlah_income IS NOT NULL AND k.jumlah_income > 0
            GROUP BY m.nama_mitra
            ORDER BY total_income DESC
            LIMIT 10;
        """)
        income_rows = cur.fetchall()
        incomeData = [
            {"no": i + 1, "instansi": row[0], "jumlah": float(row[1]) if row[1] else 0}
            for i, row in enumerate(income_rows)
        ]

        # === 5. TOP 5 KLASIFIKASI MITRA ===
        cur.execute("""
            SELECT 
                m.klasifikasi_mitra AS label,
                COUNT(*) AS count
            FROM kerjasama k
            JOIN mitra m ON k.id_mitra = m.id
            WHERE m.klasifikasi_mitra IS NOT NULL
            GROUP BY m.klasifikasi_mitra
            ORDER BY count DESC
            LIMIT 5;
        """)
        mitra_rows = cur.fetchall()
        mitraData = {
            "labels": [row[0] for row in mitra_rows],
            "data": [row[1] for row in mitra_rows]
        }

        # === 6. TOP 5 BENTUK KEGIATAN ===
        cur.execute("""
            SELECT 
                bentuk_kegiatan AS label,
                COUNT(*) AS count
            FROM kerjasama
            WHERE bentuk_kegiatan IS NOT NULL
            GROUP BY bentuk_kegiatan
            ORDER BY count DESC
            LIMIT 5;
        """)
        kegiatan_rows = cur.fetchall()
        kegiatanData = {
            "labels": [row[0] for row in kegiatan_rows],
            "data": [row[1] for row in kegiatan_rows]
        }

        # === RETURN LENGKAP + TOTAL ===
        return {
            "total_mou": total_mou,
            "total_moa": total_moa,
            "total_ia": total_ia,
            "markers": markers,
            "yearlyData": {
                "years": years,
                "MoU": MoU,
                "MoA": MoA,
                "IA": IA
            },
            "incomeData": incomeData,
            "mitraData": mitraData,
            "kegiatanData": kegiatanData
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cur.close()
        conn.close()


@app.get("/api/news")
def get_news():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, judul, gambar, tanggal FROM berita ORDER BY id DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": row[0],
            "title": row[1],
            "image": row[2],
            "date": row[3].strftime("%d %B %Y") if row[3] else None
        }
        for row in rows
    ]


@app.get("/api/faq")
def get_faq():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, pertanyaan, jawaban FROM faq ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {"id": row[0], "question": row[1], "answer": row[2]}
        for row in rows
    ]


@app.get("/api/kerjasama")
def get_kerjasama(type: str = "all"):
    from fastapi import Query
    conn = get_db_connection()
    cur = conn.cursor()
    base_query = """
        SELECT 
            k.id,
            k.id_mitra,
            k.id_negara,
            m.nama_mitra,
            k.judul_kerjasama,
            k.bentuk_kerjasama,
            k.bentuk_kegiatan,
            k.status_kerjasama,
            k.tanggal_mulai,
            k.tanggal_selesai,
            k.jumlah_income
        FROM kerjasama k
        JOIN mitra m ON k.id_mitra = m.id
    """
    if type == "all":
        cur.execute(base_query + " ORDER BY k.id DESC;")
    else:
        cur.execute(base_query + " WHERE k.bentuk_kerjasama = %s ORDER BY k.id DESC;", (type,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": row[0],
            "id_mitra": row[1],
            "id_negara": row[2],
            "nama_mitra": row[3],
            "judul_kerjasama": row[4],
            "bentuk_kerjasama": row[5],
            "bentuk_kegiatan": row[6],
            "status_kerjasama": row[7],
            "tanggal_mulai": row[8].strftime("%Y-%m-%d") if row[8] else None,
            "tanggal_selesai": row[9].strftime("%Y-%m-%d") if row[9] else None,
            "jumlah_income": float(row[10]) if row[10] else 0
        }
        for row in rows
    ]

@app.get("/api/search")
def search_kerjasama(q: str = Query(..., min_length=3)):
    conn = get_db_connection()
    cur = conn.cursor()
    
    query = """
        SELECT 
            k.id,
            m.nama_mitra,
            k.judul_kerjasama,
            k.bentuk_kerjasama,
            k.status_kerjasama,  
            n.nama_negara AS universitas
        FROM kerjasama k
        JOIN mitra m ON k.id_mitra = m.id
        LEFT JOIN negara n ON k.id_negara = n.id
        WHERE 
            LOWER(k.judul_kerjasama) LIKE LOWER(%s)
            OR LOWER(m.nama_mitra) LIKE LOWER(%s)
            OR LOWER(k.bentuk_kegiatan) LIKE LOWER(%s)
            OR LOWER(n.nama_negara) LIKE LOWER(%s)
        LIMIT 10;
    """
    like_pattern = f"%{q}%"
    cur.execute(query, (like_pattern, like_pattern, like_pattern, like_pattern))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    return [
        {
            "id": row[0],
            "mitra": row[1],
            "judul_kerjasama": row[2],
            "bentuk_kerjasama": row[3],
            "status_kerjasama": row[4], 
            "universitas": row[5] or "—"
        }
        for row in rows
    ]