import React, { useState } from 'react';
import {
    CommandLineIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const CommandsView = ({ commands, parseErrors, warnings, showDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommand, setSelectedCommand] = useState('ALL');
    const [showOnlyWithIssues, setShowOnlyWithIssues] = useState(false);

    // Get unique commands for filter
    const uniqueCommands = [...new Set(commands.map(cmd => cmd.command))].sort();

    // Filter commands based on search and filters
    const filteredCommands = commands.filter(cmd => {
        const matchesSearch = !searchTerm ||
            cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.raw.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCommand = selectedCommand === 'ALL' || cmd.command === selectedCommand;

        const hasIssues = cmd.pipes?.length > 0 || cmd.redirects?.length > 0 || cmd.flags && Object.keys(cmd.flags).length > 0;
        const matchesIssueFilter = !showOnlyWithIssues || hasIssues;

        return matchesSearch && matchesCommand && matchesIssueFilter;
    });

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar comandos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Command Filter */}
                    <div className="relative">
                        <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <select
                            value={selectedCommand}
                            onChange={(e) => setSelectedCommand(e.target.value)}
                            className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="ALL">Todos los comandos</option>
                            {uniqueCommands.map(cmd => (
                                <option key={cmd} value={cmd}>{cmd}</option>
                            ))}
                        </select>
                    </div>

                    {/* Toggle Complex Commands */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="complex-commands"
                            checked={showOnlyWithIssues}
                            onChange={(e) => setShowOnlyWithIssues(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="complex-commands" className="ml-2 text-sm text-gray-700">
                            Solo comandos complejos
                        </label>
                    </div>
                </div>
            </div>

            {/* Parse Errors */}
            {parseErrors.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                        Errores de Análisis Sintáctico ({parseErrors.length})
                    </h3>

                    <div className="space-y-3">
                        {parseErrors.map((error, index) => (
                            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-red-900">
                                        {error.message}
                                    </h4>
                                    <span className="text-sm text-red-700">
                    Línea {error.line}
                  </span>
                                </div>
                                <code className="text-sm bg-white px-2 py-1 rounded font-mono text-gray-700 break-all">
                                    {error.command}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        Advertencias ({warnings.length})
                    </h3>

                    <div className="space-y-2">
                        {warnings.map((warning, index) => (
                            <div key={index} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                                <p className="text-sm text-yellow-800">{warning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Commands List */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CommandLineIcon className="h-5 w-5 mr-2" />
                    Comandos Analizados ({filteredCommands.length})
                </h3>

                {filteredCommands.length === 0 ? (
                    <div className="text-center py-8">
                        <CommandLineIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                            No se encontraron comandos que coincidan con los filtros aplicados.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredCommands.map((cmd, index) => (
                            <CommandCard
                                key={index}
                                command={cmd}
                                showDetails={showDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente para mostrar cada comando
const CommandCard = ({ command, showDetails }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasComplexity = command.pipes?.length > 0 ||
        command.redirects?.length > 0 ||
        (command.flags && Object.keys(command.flags).length > 0);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
              <span className="font-mono font-bold text-primary-600">
                {command.command}
              </span>
                            <span className="text-sm text-gray-500">
                Línea {command.line}
              </span>
                            {hasComplexity && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Complejo
                </span>
                            )}
                        </div>

                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono break-all block">
                            {command.raw}
                        </code>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (showDetails || hasComplexity) && (
                <div className="border-t bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Arguments */}
                        {command.arguments && command.arguments.length > 0 && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                    Argumentos ({command.arguments.length})
                                </h5>
                                <div className="space-y-1">
                                    {command.arguments.map((arg, i) => (
                                        <code key={i} className="block text-xs bg-white p-2 rounded font-mono text-gray-700">
                                            {arg}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flags */}
                        {command.flags && Object.keys(command.flags).length > 0 && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                    Flags ({Object.keys(command.flags).length})
                                </h5>
                                <div className="space-y-1">
                                    {Object.entries(command.flags).map(([flag, value], i) => (
                                        <div key={i} className="text-xs bg-white p-2 rounded">
                                            <span className="font-mono text-gray-700">--{flag}</span>
                                            {value !== 'true' && (
                                                <span className="text-gray-500 ml-2">= {value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pipes */}
                        {command.pipes && command.pipes.length > 0 && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                    Pipes ({command.pipes.length})
                                </h5>
                                <div className="space-y-1">
                                    {command.pipes.map((pipe, i) => (
                                        <code key={i} className="block text-xs bg-white p-2 rounded font-mono text-gray-700">
                                            | {pipe.command} {pipe.arguments?.join(' ')}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Redirects */}
                        {command.redirects && command.redirects.length > 0 && (
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">
                                    Redirecciones ({command.redirects.length})
                                </h5>
                                <div className="space-y-1">
                                    {command.redirects.map((redirect, i) => (
                                        <code key={i} className="block text-xs bg-white p-2 rounded font-mono text-gray-700">
                                            {redirect.type} {redirect.target}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommandsView;