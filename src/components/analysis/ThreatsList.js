import React, { useState } from 'react';
import {
    ExclamationTriangleIcon,
    ShieldExclamationIcon,
    InformationCircleIcon,
    EyeIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';

const ThreatsList = ({ threats, patterns, anomalies, showDetails }) => {
    const [expandedThreat, setExpandedThreat] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('ALL');

    const threatLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    const filteredThreats = selectedLevel === 'ALL'
        ? threats
        : threats.filter(threat => threat.level === selectedLevel);

    const toggleThreatExpansion = (index) => {
        setExpandedThreat(expandedThreat === index ? null : index);
    };

    if (threats.length === 0 && patterns.length === 0 && anomalies.length === 0) {
        return (
            <div className="card text-center py-8">
                <ShieldExclamationIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ¡Excelente! No se detectaron amenazas
                </h3>
                <p className="text-gray-600">
                    El análisis no encontró comandos peligrosos o patrones sospechosos en el historial.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Threat Level Filter */}
            {threats.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Filtrar por Nivel de Amenaza
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {threatLevels.map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    selectedLevel === level
                                        ? getThreatButtonActiveStyle(level)
                                        : getThreatButtonStyle(level)
                                }`}
                            >
                                {level === 'ALL' ? 'Todas' : level}
                                {level !== 'ALL' && (
                                    <span className="ml-1">
                    ({threats.filter(t => t.level === level).length})
                  </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Threats List */}
            {filteredThreats.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        Amenazas Detectadas ({filteredThreats.length})
                    </h3>

                    <div className="space-y-4">
                        {filteredThreats.map((threat, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg ${getThreatCardStyle(threat.level)}`}
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => toggleThreatExpansion(index)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatBadgeStyle(threat.level)}`}>
                          {threat.level}
                        </span>
                                                <span className="text-sm text-gray-500">
                          Línea {threat.line}
                        </span>
                                            </div>

                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {threat.description}
                                            </h4>

                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono break-all">
                                                {threat.command}
                                            </code>
                                        </div>

                                        <button className="ml-4 text-gray-400 hover:text-gray-600">
                                            {expandedThreat === index ? (
                                                <ChevronDownIcon className="h-5 w-5" />
                                            ) : (
                                                <ChevronRightIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedThreat === index && (
                                    <div className="border-t bg-gray-50 p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                                                    Detalles del Tipo de Amenaza
                                                </h5>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Tipo:</strong> {threat.type}
                                                </p>
                                            </div>

                                            {threat.suggestions && threat.suggestions.length > 0 && (
                                                <div>
                                                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                                        <LightBulbIcon className="h-4 w-4 mr-2" />
                                                        Recomendaciones de Seguridad
                                                    </h5>
                                                    <ul className="space-y-1">
                                                        {threat.suggestions.map((suggestion, i) => (
                                                            <li key={i} className="text-sm text-gray-700 flex items-start">
                                                                <span className="text-primary-600 mr-2">•</span>
                                                                {suggestion}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Patterns Section */}
            {patterns.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <EyeIcon className="h-5 w-5 mr-2" />
                        Patrones Detectados ({patterns.length})
                    </h3>

                    <div className="space-y-4">
                        {patterns.map((pattern, index) => (
                            <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-blue-900">
                                        {pattern.description}
                                    </h4>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {pattern.occurrences} veces
                  </span>
                                </div>

                                <p className="text-sm text-blue-800 mb-3">
                                    <strong>Patrón:</strong> {pattern.pattern}
                                </p>

                                {showDetails && pattern.examples && pattern.examples.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-blue-900 mb-2">Ejemplos:</p>
                                        <div className="space-y-1">
                                            {pattern.examples.slice(0, 3).map((example, i) => (
                                                <code key={i} className="block text-xs bg-white p-2 rounded font-mono text-gray-700">
                                                    {example}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Anomalies Section */}
            {anomalies.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                        Anomalías Detectadas ({anomalies.length})
                    </h3>

                    <div className="space-y-4">
                        {anomalies.map((anomaly, index) => (
                            <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-yellow-900">
                                        {anomaly.description}
                                    </h4>
                                    <span className="text-sm text-yellow-700">
                    Línea {anomaly.line}
                  </span>
                                </div>

                                <p className="text-sm text-yellow-800 mb-2">
                                    <strong>Tipo:</strong> {anomaly.type}
                                </p>

                                <code className="text-sm bg-white px-2 py-1 rounded font-mono text-gray-700 break-all">
                                    {anomaly.command}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Funciones auxiliares para estilos
const getThreatCardStyle = (level) => {
    const styles = {
        CRITICAL: 'border-red-300 bg-red-50',
        HIGH: 'border-orange-300 bg-orange-50',
        MEDIUM: 'border-yellow-300 bg-yellow-50',
        LOW: 'border-blue-300 bg-blue-50',
        SAFE: 'border-green-300 bg-green-50'
    };
    return styles[level] || 'border-gray-300 bg-gray-50';
};

const getThreatBadgeStyle = (level) => {
    const styles = {
        CRITICAL: 'bg-red-100 text-red-800',
        HIGH: 'bg-orange-100 text-orange-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        LOW: 'bg-blue-100 text-blue-800',
        SAFE: 'bg-green-100 text-green-800'
    };
    return styles[level] || 'bg-gray-100 text-gray-800';
};

const getThreatButtonStyle = (level) => {
    const styles = {
        ALL: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        CRITICAL: 'bg-red-100 text-red-700 hover:bg-red-200',
        HIGH: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
        MEDIUM: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
        LOW: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    };
    return styles[level] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
};

const getThreatButtonActiveStyle = (level) => {
    const styles = {
        ALL: 'bg-gray-600 text-white',
        CRITICAL: 'bg-red-600 text-white',
        HIGH: 'bg-orange-600 text-white',
        MEDIUM: 'bg-yellow-600 text-white',
        LOW: 'bg-blue-600 text-white'
    };
    return styles[level] || 'bg-gray-600 text-white';
};

export default ThreatsList;