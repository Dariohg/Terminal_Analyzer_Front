import React from 'react';
import {
    ChartBarIcon,
    ClockIcon,
    CommandLineIcon,
    CpuChipIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const SummaryStats = ({ result, showDetails }) => {
    const summary = result.summary || {};
    const threatCount = summary.threat_count || {};
    const mostUsedCommands = summary.most_used_commands || [];

    const totalThreats = Object.values(threatCount).reduce((sum, count) => sum + count, 0);
    const highestThreatLevel = getHighestThreatLevel(threatCount);

    const stats = [
        {
            label: 'Total de Comandos',
            value: summary.total_commands || 0,
            icon: CommandLineIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Comandos Únicos',
            value: summary.unique_commands || 0,
            icon: CpuChipIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Total de Amenazas',
            value: totalThreats,
            icon: ExclamationTriangleIcon,
            color: totalThreats > 0 ? 'text-red-600' : 'text-green-600',
            bgColor: totalThreats > 0 ? 'bg-red-50' : 'bg-green-50'
        },
        {
            label: 'Tiempo de Procesamiento',
            value: `${summary.processing_time || 0}ms`,
            icon: ClockIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Main Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card text-center">
                            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Security Status Card */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Estado de Seguridad
                </h3>

                <div className={`p-4 rounded-lg border-l-4 ${getSecurityStatusStyle(highestThreatLevel)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-lg">
                                {getSecurityStatusMessage(highestThreatLevel, totalThreats)}
                            </h4>
                            <p className="text-sm mt-1">
                                {getSecurityRecommendation(highestThreatLevel, totalThreats)}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSecurityBadgeStyle(highestThreatLevel)}`}>
                            {highestThreatLevel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Threat Breakdown */}
            {totalThreats > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        Desglose de Amenazas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(threatCount).map(([level, count]) => (
                            <div key={level} className="text-center">
                                <div className={`p-4 rounded-lg ${getThreatLevelBg(level)}`}>
                                    <div className={`text-2xl font-bold ${getThreatLevelColor(level)}`}>
                                        {count}
                                    </div>
                                    <div className={`text-xs font-medium uppercase ${getThreatLevelColor(level)}`}>
                                        {level}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    {getPercentage(count, totalThreats)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Most Used Commands */}
            {mostUsedCommands.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="h-5 w-5 mr-2" />
                        Comandos Más Utilizados
                    </h3>

                    <div className="space-y-3">
                        {mostUsedCommands.slice(0, showDetails ? 10 : 5).map((cmd, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </span>
                                    <code className="font-mono text-sm bg-white px-2 py-1 rounded">
                                        {cmd.command}
                                    </code>
                                </div>
                                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {cmd.count} veces
                  </span>
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-600 h-2 rounded-full"
                                            style={{
                                                width: `${getPercentage(cmd.count, summary.total_commands)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!showDetails && mostUsedCommands.length > 5 && (
                        <div className="text-center mt-4">
              <span className="text-sm text-gray-500">
                Y {mostUsedCommands.length - 5} comandos más...
              </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Funciones auxiliares
const getHighestThreatLevel = (threatCount) => {
    const levels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'];
    for (const level of levels) {
        if (threatCount[level] > 0) return level;
    }
    return 'SAFE';
};

const getSecurityStatusStyle = (level) => {
    const styles = {
        CRITICAL: 'border-red-500 bg-red-50',
        HIGH: 'border-orange-500 bg-orange-50',
        MEDIUM: 'border-yellow-500 bg-yellow-50',
        LOW: 'border-blue-500 bg-blue-50',
        SAFE: 'border-green-500 bg-green-50'
    };
    return styles[level] || styles.SAFE;
};

const getSecurityBadgeStyle = (level) => {
    const styles = {
        CRITICAL: 'bg-red-100 text-red-800',
        HIGH: 'bg-orange-100 text-orange-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        LOW: 'bg-blue-100 text-blue-800',
        SAFE: 'bg-green-100 text-green-800'
    };
    return styles[level] || styles.SAFE;
};

const getThreatLevelBg = (level) => {
    const styles = {
        CRITICAL: 'bg-red-50',
        HIGH: 'bg-orange-50',
        MEDIUM: 'bg-yellow-50',
        LOW: 'bg-blue-50',
        SAFE: 'bg-green-50'
    };
    return styles[level] || styles.SAFE;
};

const getThreatLevelColor = (level) => {
    const styles = {
        CRITICAL: 'text-red-600',
        HIGH: 'text-orange-600',
        MEDIUM: 'text-yellow-600',
        LOW: 'text-blue-600',
        SAFE: 'text-green-600'
    };
    return styles[level] || styles.SAFE;
};

const getSecurityStatusMessage = (level, count) => {
    if (count === 0) return 'Historial Seguro';

    const messages = {
        CRITICAL: 'Amenazas Críticas Detectadas',
        HIGH: 'Amenazas de Alto Riesgo',
        MEDIUM: 'Actividad Sospechosa Detectada',
        LOW: 'Revisión Recomendada'
    };
    return messages[level] || 'Estado Desconocido';
};

const getSecurityRecommendation = (level, count) => {
    if (count === 0) return 'No se detectaron comandos peligrosos en el historial analizado.';

    const recommendations = {
        CRITICAL: 'Se requiere atención inmediata. Revisa los comandos críticos detectados.',
        HIGH: 'Revisa los comandos de alto riesgo y toma las medidas necesarias.',
        MEDIUM: 'Evalúa los comandos sospechosos para determinar si son legítimos.',
        LOW: 'Revisa los comandos marcados para verificar su legitimidad.'
    };
    return recommendations[level] || 'Revisa los resultados del análisis.';
};

const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

export default SummaryStats;