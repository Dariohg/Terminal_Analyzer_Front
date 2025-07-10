import React, { useState } from 'react';
import {
    FolderIcon,
    DocumentIcon,
    ExclamationTriangleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ClipboardDocumentIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const FileSystemErrorDisplay = ({ fileSystemAnalysis }) => {
    const [expandedErrors, setExpandedErrors] = useState(new Set());
    const [copiedCommands, setCopiedCommands] = useState(new Set());

    if (!fileSystemAnalysis) {
        return null;
    }

    const { errors, state, dependencies, summary } = fileSystemAnalysis;

    const toggleErrorExpansion = (index) => {
        const newExpanded = new Set(expandedErrors);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedErrors(newExpanded);
    };

    const copyCommand = async (command, index) => {
        try {
            await navigator.clipboard.writeText(command);
            setCopiedCommands(new Set([...copiedCommands, index]));
            setTimeout(() => {
                setCopiedCommands(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(index);
                    return newSet;
                });
            }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const getErrorIcon = (errorType) => {
        switch (errorType) {
            case 'directory_not_found':
            case 'parent_directory_not_found':
                return <FolderIcon className="h-5 w-5 text-red-500" />;
            case 'file_not_found':
                return <DocumentIcon className="h-5 w-5 text-red-500" />;
            case 'directory_exists':
                return <FolderIcon className="h-5 w-5 text-yellow-500" />;
            case 'missing_argument':
                return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
            default:
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
        }
    };

    const getErrorColor = (errorType) => {
        switch (errorType) {
            case 'directory_not_found':
            case 'file_not_found':
            case 'parent_directory_not_found':
                return 'border-red-200 bg-red-50';
            case 'directory_exists':
                return 'border-yellow-200 bg-yellow-50';
            case 'missing_argument':
                return 'border-orange-200 bg-orange-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    if (errors.length === 0 && dependencies.length === 0) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
                    <div>
                        <h3 className="text-lg font-medium text-green-800">
                            Sistema de Archivos Consistente
                        </h3>
                        <p className="mt-1 text-sm text-green-700">
                            Todos los comandos tienen las dependencias necesarias. No se detectaron errores del sistema de archivos.
                        </p>
                    </div>
                </div>

                {/* Estado del sistema */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{state.directory_count}</div>
                        <div className="text-green-700">Directorios</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{state.file_count}</div>
                        <div className="text-green-700">Archivos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{state.created_directories?.length || 0}</div>
                        <div className="text-green-700">Dirs Creados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{state.created_files?.length || 0}</div>
                        <div className="text-green-700">Archivos Creados</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Resumen de errores del sistema de archivos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FolderIcon className="h-5 w-5 text-blue-500 mr-2" />
                    Análisis del Sistema de Archivos
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{summary.total_errors}</div>
                        <div className="text-sm text-red-700">Errores Totales</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{summary.missing_directories}</div>
                        <div className="text-sm text-orange-700">Dirs Faltantes</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{summary.missing_files}</div>
                        <div className="text-sm text-yellow-700">Archivos Faltantes</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{dependencies.length}</div>
                        <div className="text-sm text-blue-700">Dependencias</div>
                    </div>
                </div>

                {/* Estado actual del sistema */}
                <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Estado Actual del Sistema</h4>
                    <div className="text-sm text-gray-600">
                        <p><strong>Directorio actual:</strong> {state.current_directory}</p>
                        {state.created_directories?.length > 0 && (
                            <p className="mt-1">
                                <strong>Directorios creados:</strong> {state.created_directories.join(', ')}
                            </p>
                        )}
                        {state.created_files?.length > 0 && (
                            <p className="mt-1">
                                <strong>Archivos creados:</strong> {state.created_files.join(', ')}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista de errores */}
            {errors.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        Errores del Sistema de Archivos ({errors.length})
                    </h3>

                    {errors.map((error, index) => {
                        const isExpanded = expandedErrors.has(index);

                        return (
                            <div key={index} className={`border rounded-lg p-4 ${getErrorColor(error.type)}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        {getErrorIcon(error.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Línea {error.line}: {error.description}
                                                </h4>
                                                {error.missing_dependency && (
                                                    <button
                                                        onClick={() => toggleErrorExpansion(index)}
                                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronDownIcon className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRightIcon className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mt-1">
                                                <code className="text-sm bg-gray-800 text-gray-100 px-2 py-1 rounded">
                                                    {error.command}
                                                </code>
                                            </div>

                                            {error.path && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <strong>Ruta problemática:</strong> <code className="bg-gray-100 px-1 rounded">{error.path}</code>
                                                </div>
                                            )}

                                            {/* Sugerencia */}
                                            <div className="mt-2 p-2 bg-white rounded border-l-2 border-blue-400">
                                                <p className="text-sm text-blue-800">
                                                    💡 {error.suggestion}
                                                </p>
                                            </div>

                                            {/* Dependencia faltante */}
                                            {error.missing_dependency && isExpanded && (
                                                <div className="mt-3 p-3 bg-white rounded border-l-4 border-green-400">
                                                    <h5 className="text-sm font-medium text-green-800 mb-2">
                                                        Comando Requerido:
                                                    </h5>
                                                    <div className="flex items-center justify-between bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                                                        <span>$ {error.missing_dependency.required}</span>
                                                        <button
                                                            onClick={() => copyCommand(error.missing_dependency.required, `dep-${index}`)}
                                                            className="ml-2 p-1 text-green-400 hover:text-green-300"
                                                            title="Copiar comando"
                                                        >
                                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        Ejecute este comando antes de "{error.command}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cadenas de dependencias */}
            {dependencies.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ArrowPathIcon className="h-5 w-5 text-blue-500 mr-2" />
                        Dependencias Detectadas ({dependencies.length})
                    </h3>

                    {dependencies.map((dep, index) => (
                        <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <ArrowPathIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-blue-900">
                                        Línea {dep.line}: Comando con dependencias
                                    </h4>
                                    <div className="mt-1">
                                        <code className="text-sm bg-blue-800 text-blue-100 px-2 py-1 rounded">
                                            {dep.command}
                                        </code>
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-blue-800 mb-2">Comandos requeridos:</p>
                                        <div className="space-y-1">
                                            {dep.dependencies.map((requiredCmd, cmdIndex) => (
                                                <div key={cmdIndex} className="flex items-center justify-between bg-blue-900 text-blue-100 p-2 rounded font-mono text-sm">
                                                    <span>$ {requiredCmd}</span>
                                                    <button
                                                        onClick={() => copyCommand(requiredCmd, `chain-${index}-${cmdIndex}`)}
                                                        className="ml-2 p-1 text-blue-300 hover:text-blue-100"
                                                        title="Copiar comando"
                                                    >
                                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ejemplo de secuencia corregida */}
            {(errors.length > 0 || dependencies.length > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Secuencia Sugerida
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                        Para evitar errores del sistema de archivos, ejecute los comandos en este orden:
                    </p>
                    <div className="bg-green-900 text-green-100 p-3 rounded font-mono text-sm">
                        <div className="space-y-1">
                            {/* Ejemplo de secuencia ordenada */}
                            <div># 1. Crear directorios necesarios</div>
                            <div>mkdir directorio1 directorio2</div>
                            <div className="mt-2"># 2. Crear archivos</div>
                            <div>touch archivo1.txt archivo2.txt</div>
                            <div className="mt-2"># 3. Ejecutar comandos que dependen de ellos</div>
                            <div>cd directorio1</div>
                            <div>cat archivo1.txt</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificación de copiado */}
            {copiedCommands.size > 0 && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    ✓ Comando copiado al portapapeles
                </div>
            )}
        </div>
    );
};

export default FileSystemErrorDisplay;