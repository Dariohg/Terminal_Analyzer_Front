import React, { useState, useEffect } from 'react';
import {
    QuestionMarkCircleIcon,
    ShieldExclamationIcon,
    BookOpenIcon,
    CodeBracketIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const CommandHelpTooltip = ({ command, onClose, position }) => {
    const [helpData, setHelpData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (command) {
            fetchCommandHelp(command);
        }
    }, [command]);

    const fetchCommandHelp = async (cmd) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/command-help/${cmd}`);
            const data = await response.json();
            setHelpData(data.help);
        } catch (error) {
            console.error('Error fetching command help:', error);
            setHelpData(null);
        } finally {
            setLoading(false);
        }
    };

    if (!command) return null;

    return (
        <div
            className="absolute z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4"
            style={{
                top: position?.top || 0,
                left: position?.left || 0,
                maxHeight: '400px',
                overflowY: 'auto'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Ayuda: <code className="text-blue-600">{command}</code>
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : helpData ? (
                <div className="space-y-4">
                    {/* Descripción */}
                    {helpData.description && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Descripción</h4>
                            <p className="text-sm text-gray-700">{helpData.description}</p>
                        </div>
                    )}

                    {/* Sintaxis */}
                    {helpData.syntax && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <CodeBracketIcon className="h-4 w-4 mr-1" />
                                Sintaxis
                            </h4>
                            <code className="text-sm bg-gray-100 p-2 rounded block font-mono">
                                {helpData.syntax}
                            </code>
                        </div>
                    )}

                    {/* Flags comunes */}
                    {helpData.common_flags && helpData.common_flags.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Opciones Comunes</h4>
                            <div className="space-y-1">
                                {helpData.common_flags.map((flag, index) => (
                                    <div key={index} className="text-sm text-gray-700">
                                        <code className="bg-gray-100 px-1 rounded">{flag}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ejemplos */}
                    {helpData.examples && helpData.examples.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplos</h4>
                            <div className="space-y-2">
                                {helpData.examples.map((example, index) => (
                                    <code key={index} className="text-sm bg-gray-900 text-green-400 p-2 rounded block font-mono">
                                        $ {example}
                                    </code>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notas de seguridad */}
                    {helpData.security_notes && helpData.security_notes.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                                <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                                Notas de Seguridad
                            </h4>
                            <ul className="space-y-1">
                                {helpData.security_notes.map((note, index) => (
                                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                                        <span className="text-yellow-500 mr-2">•</span>
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Alternativas/Sugerencias */}
                    {helpData.alternatives && helpData.alternatives.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Sugerencias</h4>
                            <ul className="space-y-1">
                                {helpData.alternatives.map((alt, index) => (
                                    <li key={index} className="text-sm text-blue-700 flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        {alt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Sugerencia genérica */}
                    {helpData.suggestion && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{helpData.suggestion}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                        No se pudo cargar la información de ayuda para este comando.
                    </p>
                </div>
            )}
        </div>
    );
};

// Hook personalizado para mostrar ayuda de comandos
export const useCommandHelp = () => {
    const [helpVisible, setHelpVisible] = useState(false);
    const [currentCommand, setCurrentCommand] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const showHelp = (command, event) => {
        if (event) {
            const rect = event.target.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
        }
        setCurrentCommand(command);
        setHelpVisible(true);
    };

    const hideHelp = () => {
        setHelpVisible(false);
        setCurrentCommand('');
    };

    return {
        helpVisible,
        currentCommand,
        position,
        showHelp,
        hideHelp,
        CommandHelpTooltip: helpVisible ? CommandHelpTooltip : null
    };
};

export default CommandHelpTooltip;