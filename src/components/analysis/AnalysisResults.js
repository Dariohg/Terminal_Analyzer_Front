import React, { useState } from 'react';
import {
    ChartBarIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    CpuChipIcon,
    EyeIcon,
    EyeSlashIcon,
    ClockIcon,
    CommandLineIcon
} from '@heroicons/react/24/outline';
import ThreatsList from './ThreatsList';
import TokensView from './TokensView';
import CommandsView from './CommandsView';
import SummaryStats from './SummaryStats';

const AnalysisResults = ({ result }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const [showDetails, setShowDetails] = useState(false);

    if (!result) return null;

    const tabs = [
        {
            id: 'summary',
            name: 'Resumen',
            icon: ChartBarIcon,
            count: null
        },
        {
            id: 'threats',
            name: 'Amenazas',
            icon: ExclamationTriangleIcon,
            count: result.semantic_analysis?.threats?.length || 0
        },
        {
            id: 'commands',
            name: 'Comandos',
            icon: CommandLineIcon,
            count: result.syntax_analysis?.commands?.length || 0
        },
        {
            id: 'tokens',
            name: 'Tokens',
            icon: CpuChipIcon,
            count: result.lexical_analysis?.tokens?.length || 0
        }
    ];

    const processingTime = result.summary?.processing_time || 0;
    const threatCount = result.summary?.threat_count || {};
    const totalThreats = Object.values(threatCount).reduce((sum, count) => sum + count, 0);

    return (
        <div className="space-y-6">
            {/* Header with Quick Stats */}
            <div className="card">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Resultados del Análisis
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                  {processingTime}ms
              </span>
                            <span className="flex items-center">
                <CommandLineIcon className="h-4 w-4 mr-1" />
                                {result.summary?.total_commands || 0} comandos
              </span>
                            <span className="flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                {totalThreats} amenazas
              </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="btn-secondary flex items-center"
                    >
                        {showDetails ? (
                            <>
                                <EyeSlashIcon className="h-4 w-4 mr-2" />
                                Ocultar detalles
                            </>
                        ) : (
                            <>
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Ver detalles
                            </>
                        )}
                    </button>
                </div>

                {/* Threat Level Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(threatCount).map(([level, count]) => (
                        <div
                            key={level}
                            className={`text-center p-3 rounded-lg border ${getThreatLevelStyle(level)}`}
                        >
                            <div className="text-2xl font-bold">{count}</div>
                            <div className="text-xs font-medium uppercase">{level}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
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
                                <span>{tab.name}</span>
                                {tab.count !== null && (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        activeTab === tab.id
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                    {tab.count}
                  </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'summary' && (
                    <SummaryStats
                        result={result}
                        showDetails={showDetails}
                    />
                )}

                {activeTab === 'threats' && (
                    <ThreatsList
                        threats={result.semantic_analysis?.threats || []}
                        patterns={result.semantic_analysis?.patterns || []}
                        anomalies={result.semantic_analysis?.anomalies || []}
                        showDetails={showDetails}
                    />
                )}

                {activeTab === 'commands' && (
                    <CommandsView
                        commands={result.syntax_analysis?.commands || []}
                        parseErrors={result.syntax_analysis?.parse_errors || []}
                        warnings={result.syntax_analysis?.warnings || []}
                        showDetails={showDetails}
                    />
                )}

                {activeTab === 'tokens' && (
                    <TokensView
                        tokens={result.lexical_analysis?.tokens || []}
                        tokenStats={result.lexical_analysis?.token_stats || {}}
                        lexicalErrors={result.lexical_analysis?.errors || []}
                        showDetails={showDetails}
                    />
                )}
            </div>

            {/* Raw Data (when showing details) */}
            {showDetails && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Datos Completos (JSON)
                    </h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-xs font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

// Función auxiliar para obtener estilos de nivel de amenaza
const getThreatLevelStyle = (level) => {
    const styles = {
        CRITICAL: 'threat-critical',
        HIGH: 'threat-high',
        MEDIUM: 'threat-medium',
        LOW: 'threat-low',
        SAFE: 'threat-safe'
    };
    return styles[level] || 'bg-gray-50 border-gray-200 text-gray-800';
};

export default AnalysisResults;