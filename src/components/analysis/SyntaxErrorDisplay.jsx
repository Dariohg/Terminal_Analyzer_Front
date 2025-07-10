import React, { useState } from 'react';
import {
    ExclamationTriangleIcon,
    LightBulbIcon,
    ShieldExclamationIcon,
    ClipboardDocumentIcon,
    ChevronDownIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const SyntaxErrorDisplay = ({ syntaxAnalysis }) => {
    const [expandedErrors, setExpandedErrors] = useState(new Set());
    const [copiedSuggestions, setCopiedSuggestions] = useState(new Set());

    const toggleErrorExpansion = (index) => {
        const newExpanded = new Set(expandedErrors);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedErrors(newExpanded);
    };

    const copySuggestion = async (suggestion, index) => {
        try {
            await navigator.clipboard.writeText(suggestion);
            setCopiedSuggestions(new Set([...copiedSuggestions, index]));
            setTimeout(() => {
                setCopiedSuggestions(prev => {
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
            case 'spelling_error':
                return <LightBulbIcon className="h-5 w-5 text-amber-500" />;
            case 'unknown_command':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            case 'missing_argument':
                return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
            default:
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
        }
    };

    const getErrorColor = (errorType) => {
        switch (errorType) {
            case 'spelling_error':
                return 'border-amber-200 bg-amber-50';
            case 'unknown_command':
                return 'border-red-200 bg-red-50';
            case 'missing_argument':
                return 'border-orange-200 bg-orange-50';
            default:
                return 'border-red-200 bg-red-50';
        }
    };

    const getSecurityLevelColor = (level) => {
        switch (level) {
            case 'low':
                return 'text-blue-600 bg-blue-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'high':
                return 'text-orange-600 bg-orange-100';
            case 'critical':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (!syntaxAnalysis?.parse_errors?.length && !syntaxAnalysis?.warnings?.length) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                            Análisis Sintáctico Completado
                        </h3>
                        <p className="mt-1 text-sm text-green-700">
                            No se encontraron errores sintácticos en los comandos analizados.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Errores de Sintaxis */}
            {syntaxAnalysis?.parse_errors?.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                        Errores Sintácticos ({syntaxAnalysis.parse_errors.length})
                    </h3>

                    {syntaxAnalysis.parse_errors.map((error, index) => {
                        const isExpanded = expandedErrors.has(index);
                        const hasValidation = error.validation && (
                            error.validation.spelling_suggestion ||
                            error.validation.structure_errors?.length > 0 ||
                            error.validation.security_warnings?.length > 0
                        );

                        return (
                            <div key={index} className={`border rounded-lg p-4 ${getErrorColor(error.type)}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        {getErrorIcon(error.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Línea {error.line}: {error.message}
                                                </h4>
                                                {hasValidation && (
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

                                            {/* Sugerencia de Ortografía */}
                                            {error.validation?.spelling_suggestion && (
                                                <div className="mt-3 p-3 bg-white rounded border-l-4 border-amber-400">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h5 className="text-sm font-medium text-amber-800">
                                                                ¿Quisiste decir?
                                                            </h5>
                                                            <p className="text-sm text-amber-700 mt-1">
                                                                <span className="line-through text-red-600">{error.validation.spelling_suggestion.original}</span>
                                                                {' → '}
                                                                <span className="font-semibold text-green-600">{error.validation.spelling_suggestion.suggested}</span>
                                                            </p>
                                                            <p className="text-xs text-amber-600 mt-1">
                                                                Confianza: {Math.round(error.validation.spelling_suggestion.confidence * 100)}%
                                                                • {error.validation.spelling_suggestion.reason}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => copySuggestion(error.validation.spelling_suggestion.suggested, `spell-${index}`)}
                                                            className="ml-3 p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
                                                            title="Copiar sugerencia"
                                                        >
                                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Alternativas adicionales */}
                                                    {error.validation.spelling_suggestion.alternatives?.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-amber-700 font-medium">Otras opciones:</p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {error.validation.spelling_suggestion.alternatives.map((alt, altIndex) => (
                                                                    <span
                                                                        key={altIndex}
                                                                        className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded cursor-pointer hover:bg-amber-200"
                                                                        onClick={() => copySuggestion(alt.command, `alt-${index}-${altIndex}`)}
                                                                        title={`Similitud: ${Math.round(alt.similarity * 100)}%`}
                                                                    >
                                                                        {alt.command}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Detalles expandidos */}
                                            {isExpanded && (
                                                <div className="mt-3 space-y-3">
                                                    {/* Errores estructurales */}
                                                    {error.validation?.structure_errors?.map((structError, structIndex) => (
                                                        <div key={structIndex} className="p-3 bg-white rounded border-l-4 border-orange-400">
                                                            <h5 className="text-sm font-medium text-orange-800">Error Estructural</h5>
                                                            <p className="text-sm text-orange-700 mt-1">{structError.description}</p>
                                                            {structError.suggestion && (
                                                                <p className="text-xs text-orange-600 mt-1">
                                                                    💡 {structError.suggestion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Advertencias de seguridad */}
                                                    {error.validation?.security_warnings?.map((warning, warnIndex) => (
                                                        <div key={warnIndex} className="p-3 bg-white rounded border-l-4 border-red-400">
                                                            <div className="flex items-center">
                                                                <ShieldExclamationIcon className="h-4 w-4 text-red-500 mr-2" />
                                                                <span className={`text-xs px-2 py-1 rounded font-medium ${getSecurityLevelColor(warning.level)}`}>
                                                                    {warning.level.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <h5 className="text-sm font-medium text-red-800 mt-2">{warning.type}</h5>
                                                            <p className="text-sm text-red-700 mt-1">{warning.description}</p>
                                                            {warning.suggestion && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    🛡️ {warning.suggestion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
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

            {/* Advertencias Generales */}
            {syntaxAnalysis?.warnings?.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        Advertencias ({syntaxAnalysis.warnings.length})
                    </h3>

                    <div className="space-y-2">
                        {syntaxAnalysis.warnings.map((warning, index) => (
                            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex">
                                    <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-800">{warning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resumen de errores */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen del Análisis Sintáctico</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Comandos parseados:</span>
                        <span className="ml-2 font-medium">{syntaxAnalysis?.commands?.length || 0}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Errores encontrados:</span>
                        <span className="ml-2 font-medium text-red-600">{syntaxAnalysis?.parse_errors?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Notificación de copiado */}
            {copiedSuggestions.size > 0 && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    ✓ Sugerencia copiada al portapapeles
                </div>
            )}
        </div>
    );
};

export default SyntaxErrorDisplay;