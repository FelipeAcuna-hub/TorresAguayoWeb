// CONFIGURACIÓN GLOBAL DE CREDENCIALES Y LOGÍSTICA — TORRES AGUAYO
const CONFIG = {
    SUPABASE_URL: "https://bdbpiaucsrrsdlykokdf.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkYnBpYXVjc3Jyc2RseWtva2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODc2ODYsImV4cCI6MjA5NDg2MzY4Nn0.2HRWzoCBFpYDUs0Qk_vj9Z_0FAyEZbuu9czH3KY8JWc",
    EMAIL_ADMINISTRADOR: "torresaguayo142@gmail.com" // <--- Tu correo maestro de control
};

// MOTOR DE INYECCIÓN Y GUARDIÁN DE MENÚ GLOBAL
async function inicializarMenuGlobal(pestanaActivaId) {
    try {
        // 1. Descargamos la estructura limpia del Navbar
        const respHeader = await fetch('components/header.html');
        const headerContenedor = document.getElementById('header-contenedor');
        if (!headerContenedor) return; // Si la página no tiene el anclaje, cancelamos
        
        headerContenedor.innerHTML = await respHeader.text();

        // 2. Corregimos el texto del botón de apariencia según el modo cargado
        const btnApariencia = document.getElementById('btn-apariencia');
        if (btnApariencia && !document.documentElement.classList.contains('dark')) {
            btnApariencia.innerText = "Modo Oscuro 🌙";
        }

        // 3. Inicializamos Supabase Auth en segundo plano
        const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        const { data: { session } } = await supabaseClient.auth.getSession();

        // 4. EVALUACIÓN DE ROL Y AUTENTICACIÓN EN TIEMPO REAL
        if (session) {
            const user = session.user;
            
            // Pintamos el saludo dinámico de inmediato
            const saludoNav = document.getElementById('saludo-nav');
            if (saludoNav) {
                saludoNav.innerText = user.email.toLowerCase() === CONFIG.EMAIL_ADMINISTRADOR.toLowerCase()
                    ? `Modo Root: ${user.email.split('@')[0]}`
                    : `Bienvenido, ${user.email.split('@')[0]}`;
                saludoNav.classList.remove('opacity-0');
                saludoNav.classList.add('opacity-100');
            }

            // SI ES EL ADMINISTRADOR: Activamos la pestaña secreta de forma global
            if (user.email.toLowerCase() === CONFIG.EMAIL_ADMINISTRADOR.toLowerCase()) {
                const linkAdmin = document.getElementById('link-admin');
                if (linkAdmin) {
                    linkAdmin.classList.remove('hidden');
                    linkAdmin.classList.add('inline-block');
                }
            }
        }

        // 5. ILUMINAR LA PESTAÑA ACTIVA EN LA QUE ESTÁ NAVEGANDO
        if (pestanaActivaId) {
            const linkActivo = document.getElementById(pestanaActivaId);
            if (linkActivo) {
                // Removemos el color gris de inactividad
                linkActivo.classList.remove('text-gray-400', 'dark:text-gray-500');
                // Metemos la línea de estado sólida (Negra/Blanca según el tema)
                linkActivo.classList.add('text-black', 'dark:text-white', 'border-black', 'dark:border-white');
            }
        }

    } catch (error) {
        console.error("Error en el core del ecosistema de navegación:", error);
    }
}