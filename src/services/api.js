import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Configurar axios con base URL y interceptores
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de request para logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor de response para manejo de errores
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.data || error.message);

        // Manejo específico de errores
        if (error.response?.status === 413) {
            throw new Error('El archivo es demasiado grande. Máximo 10MB permitido.');
        }

        if (error.response?.status === 400) {
            throw new Error(error.response.data?.error || 'Error en la solicitud');
        }

        if (error.response?.status === 500) {
            throw new Error('Error interno del servidor. Intenta más tarde.');
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('La solicitud tardó demasiado. Intenta con un archivo más pequeño.');
        }

        if (!error.response) {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }

        throw error;
    }
);

// Servicios de análisis
export const analysisService = {
    // Subir archivo para análisis
    uploadFile: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        if (onProgress) {
            config.onUploadProgress = (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(progress);
            };
        }

        const response = await api.post('/api/v1/analysis/upload', formData, config);
        return response.data;
    },

    // Analizar texto directo
    analyzeText: async (content, filename = '') => {
        const response = await api.post('/api/v1/analysis/text', {
            content,
            filename,
        });
        return response.data;
    },

    // Obtener análisis de demo
    getDemoAnalysis: async () => {
        const response = await api.get('/api/v1/analysis/demo');
        return response.data;
    },
};

// Servicios de información
export const infoService = {
    // Obtener comandos conocidos
    getKnownCommands: async () => {
        const response = await api.get('/api/v1/info/commands');
        return response.data;
    },

    // Obtener tipos de amenazas
    getThreatTypes: async () => {
        const response = await api.get('/api/v1/info/threats');
        return response.data;
    },
};

// Servicio de salud
export const healthService = {
    // Verificar estado del servidor
    checkHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

// Utilidades
export const apiUtils = {
    // Validar archivo antes de subir
    validateFile: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['text/plain', 'application/octet-stream', ''];

        if (file.size > maxSize) {
            throw new Error('El archivo es demasiado grande. Máximo 10MB permitido.');
        }

        // Verificar extensión si el tipo MIME no está disponible
        const fileName = file.name.toLowerCase();
        const historyExtensions = [
            'history', 'bash_history', 'zsh_history', 'fish_history'
        ];

        const hasValidExtension = historyExtensions.some(ext =>
            fileName.includes(ext) || fileName.endsWith('.txt')
        );

        if (!allowedTypes.includes(file.type) && !hasValidExtension) {
            console.warn('Tipo de archivo no reconocido, pero se permitirá:', file.type);
        }

        return true;
    },

    // Formatear tamaño de archivo
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validar contenido de texto
    validateContent: (content) => {
        if (!content || content.trim().length === 0) {
            throw new Error('El contenido no puede estar vacío');
        }

        if (content.length > 1024 * 1024) { // 1MB para texto
            throw new Error('El contenido es demasiado largo');
        }

        return true;
    },
};

export default api;