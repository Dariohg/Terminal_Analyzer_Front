import React, { useState } from 'react';
import {
    CpuChipIcon,
    ExclamationCircleIcon,
    ChartBarIcon,
    EyeIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const TokensView = ({ tokens, tokenStats, lexicalErrors, showDetails }) => {
    const [selectedTokenType, setSelectedTokenType] = useState('ALL');
    const [showTokenValues, setShowTokenValues] = useState(false);

    // Get unique token types for filter
    const tokenTypes = Object.keys(tokenStats).sort();

    // Filter tokens based on type
    const filteredTokens = selectedTokenType === 'ALL'
        ? tokens
        : tokens.filter(token => token.type === selectedTokenType);

    // Prepare token stats for visualization
    const tokenStatsArray = Object.entries(tokenStats)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

    const totalTokens = Object.values(tokenStats).reduce((sum, count) => sum + count, 0);

    return (
        <div className="space-y-6">
            {/* Token Statistics */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Estadísticas de Tokens
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {tokenStatsArray.slice(0, showDetails ? tokenStatsArray.length : 6).map(({ type, count }) => (
                        <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold ${getTokenTypeColor(type)}`}>
                                {count}
                            </div>
                            <div className="text-xs font-medium text-gray-600 uppercase">
                                {type}
                            </div>
                            <div className="text-xs text-gray-500">
                                {getPercentage(count, totalTokens)}%
                            </div>
                        </div>
                    ))}
                </div>

                {/* Token Distribution Chart */}
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Distribución de Tokens</h4>
                    {tokenStatsArray.slice(0, showDetails ? tokenStatsArray.length : 8).map(({ type, count }) => (
                        <div key={type} className="flex items-center space-x-4">
                            <div className="w-20 text-xs font-medium text-gray-700 uppercase">
                                {type}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${getTokenTypeBarColor(type)}`}
                                    style={{ width: `${getPercentage(count, totalTokens)}%` }}
                                />
                            </div>
                            <div className="w-12 text-xs text-gray-600 text-right">
                                {count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lexical Errors */}
            {lexicalErrors.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                        Errores Léxicos ({lexicalErrors.length})
                    </h3>

                    <div className="space-y-3">
                        {lexicalErrors.map((error, index) => (
                            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-red-900 mb-1">
                                            {error.message}
                                        </h4>
                                        <p className="text-sm text-red-700">
                                            Línea {error.line}, Posición {error.position}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Token Filter and Controls */}
            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CpuChipIcon className="h-5 w-5 mr-2" />
                        Tokens Detectados ({filteredTokens.length})
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* Token Type Filter */}
                        <div className="relative">
                            <FunnelIcon className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                            <select
                                value={selectedTokenType}
                                onChange={(e) => setSelectedTokenType(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="ALL">Todos los tipos</option>
                                {tokenTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type} ({tokenStats[type]})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Toggle Token Values */}
                        <button
                            onClick={() => setShowTokenValues(!showTokenValues)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center ${
                                showTokenValues
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {showTokenValues ? 'Ocultar valores' : 'Mostrar valores'}
                        </button>
                    </div>
                </div>

                {/* Tokens List */}
                {filteredTokens.length === 0 ? (
                    <div className="text-center py-8">
                        <CpuChipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            No se encontraron tokens del tipo seleccionado.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {(showDetails ? filteredTokens : filteredTokens.slice(0, 50)).map((token, index) => (
                            <TokenItem
                                key={index}
                                token={token}
                                showValue={showTokenValues}
                            />
                        ))}

                        {!showDetails && filteredTokens.length > 50 && (
                            <div className="text-center py-4 text-sm text-gray-500">
                                Mostrando los primeros 50 tokens. Activa "Ver detalles" para ver todos.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Token Type Definitions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Definiciones de Tipos de Token
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTokenDefinitions().map((definition, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTokenTypeBadgeStyle(definition.type)}`}>
                  {definition.type}
                </span>
                                <span className="text-sm text-gray-600">
                  {tokenStats[definition.type] || 0} encontrados
                </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                {definition.description}
                            </p>
                            {definition.examples.length > 0 && (
                                <div className="space-y-1">
                                    {definition.examples.map((example, i) => (
                                        <code key={i} className="block text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                            {example}
                                        </code>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente para mostrar cada token individual
const TokenItem = ({ token, showValue }) => {
    return (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTokenTypeBadgeStyle(token.type)}`}>
          {token.type}
        </span>

                {showValue && (
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {token.value}
                    </code>
                )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>L:{token.line}</span>
                <span>P:{token.position}</span>
            </div>
        </div>
    );
};

// Funciones auxiliares
const getTokenTypeColor = (type) => {
    const colors = {
        COMMAND: 'text-blue-600',
        ARGUMENT: 'text-green-600',
        FLAG: 'text-purple-600',
        PATH: 'text-orange-600',
        URL: 'text-red-600',
        PIPE: 'text-indigo-600',
        REDIRECT: 'text-pink-600',
        VARIABLE: 'text-yellow-600',
        STRING: 'text-cyan-600',
        NUMBER: 'text-emerald-600'
    };
    return colors[type] || 'text-gray-600';
};

const getTokenTypeBarColor = (type) => {
    const colors = {
        COMMAND: 'bg-blue-500',
        ARGUMENT: 'bg-green-500',
        FLAG: 'bg-purple-500',
        PATH: 'bg-orange-500',
        URL: 'bg-red-500',
        PIPE: 'bg-indigo-500',
        REDIRECT: 'bg-pink-500',
        VARIABLE: 'bg-yellow-500',
        STRING: 'bg-cyan-500',
        NUMBER: 'bg-emerald-500'
    };
    return colors[type] || 'bg-gray-500';
};

const getTokenTypeBadgeStyle = (type) => {
    const styles = {
        COMMAND: 'bg-blue-100 text-blue-800',
        ARGUMENT: 'bg-green-100 text-green-800',
        FLAG: 'bg-purple-100 text-purple-800',
        PATH: 'bg-orange-100 text-orange-800',
        URL: 'bg-red-100 text-red-800',
        PIPE: 'bg-indigo-100 text-indigo-800',
        REDIRECT: 'bg-pink-100 text-pink-800',
        VARIABLE: 'bg-yellow-100 text-yellow-800',
        STRING: 'bg-cyan-100 text-cyan-800',
        NUMBER: 'bg-emerald-100 text-emerald-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
};

const getTokenDefinitions = () => [
    {
        type: 'COMMAND',
        description: 'Comandos principales que se ejecutan',
        examples: ['ls', 'cd', 'grep', 'sudo']
    },
    {
        type: 'ARGUMENT',
        description: 'Argumentos pasados a los comandos',
        examples: ['filename.txt', 'directory', 'pattern']
    },
    {
        type: 'FLAG',
        description: 'Opciones y flags de comandos',
        examples: ['-la', '--help', '-rf']
    },
    {
        type: 'PATH',
        description: 'Rutas de archivos y directorios',
        examples: ['/home/user', '~/documents', './script.sh']
    },
    {
        type: 'URL',
        description: 'URLs y enlaces web',
        examples: ['http://example.com', 'https://site.org']
    },
    {
        type: 'PIPE',
        description: 'Operadores de pipe para encadenar comandos',
        examples: ['|']
    },
    {
        type: 'REDIRECT',
        description: 'Operadores de redirección',
        examples: ['>', '>>', '<']
    },
    {
        type: 'VARIABLE',
        description: 'Variables de entorno y del shell',
        examples: ['$PATH', '$HOME', '${USER}']
    },
    {
        type: 'STRING',
        description: 'Cadenas de texto con comillas',
        examples: ['"hello world"', "'file name'"]
    },
    {
        type: 'NUMBER',
        description: 'Valores numéricos',
        examples: ['123', '456', '789']
    }
];

const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

export default TokensView;