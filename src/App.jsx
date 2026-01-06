import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Mail, Phone, Filter, X, Calendar, Target, Zap, Clock, Users, ArrowRight, Home, Briefcase, Key, Building2, Building, FileText, MousePointer, Megaphone, User, TrendingUp, CalendarClock, Folder } from 'lucide-react';

const CampaignArchitecture = () => {
  const [expandedReports, setExpandedReports] = useState([]);
  const [expandedCampaignIds, setExpandedCampaignIds] = useState([]);
  const [expandedFlows, setExpandedFlows] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://report-dashboard-backend-iniq.onrender.com/api/campaigns');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('Campaign data loaded:', jsonData);
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching campaign data:', err);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Icon mapping
  const iconMap = {
    'buyers': Home,
    'buyers-investors': Briefcase,
    'tenants': Key,
    'sellers': Building2,
    'landlords': Building,
    'refer': Megaphone,
    'retain': Users,
    'reheat': TrendingUp
  };

  const stages = [
    { id: 'discovery', name: 'Discovery', color: '#1F343F' },
    { id: 'lead', name: 'Lead', color: '#2C537A' },
    { id: 'qualified', name: 'Qualified', color: '#2C537A' },
    { id: 'viewing', name: 'Viewing', color: '#7BA0B2' },
    { id: 'offer', name: 'Offer', color: '#D9B9A0' },
    { id: 'deal', name: 'Deal', color: '#2C537A' }
  ];

  const getChannelIcon = (channel) => {
    switch(channel) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <Phone className="w-3 h-3" />;
      case 'ma': return <Filter className="w-3 h-3" />;
      default: return <Mail className="w-3 h-3" />;
    }
  };

  const getChannelColor = (channel) => {
    switch(channel) {
      case 'email': return { bg: '#2C537A', text: '#FFFFFF', border: '#1F343F' };
      case 'sms': return { bg: '#7BA0B2', text: '#1F343F', border: '#2C537A' };
      case 'ma': return { bg: '#D9B9A0', text: '#1F343F', border: '#7BA0B2' };
      default: return { bg: '#EDE8E4', text: '#1F343F', border: '#D9B9A0' };
    }
  };

  const toggleReport = (reportId) => {
    setExpandedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const toggleCampaignId = (campaignIdKey) => {
    setExpandedCampaignIds(prev =>
      prev.includes(campaignIdKey)
        ? prev.filter(id => id !== campaignIdKey)
        : [...prev, campaignIdKey]
    );
  };

  const toggleFlow = (flowKey) => {
    setExpandedFlows(prev =>
      prev.includes(flowKey)
        ? prev.filter(id => id !== flowKey)
        : [...prev, flowKey]
    );
  };

  const openStagePanel = (report, campaignId, flow, stageId, stageName) => {
    const campaigns = flow.stages[stageId]?.campaigns || [];
    
    setSelectedStage({
      reportId: report.id,
      campaignIdGroup: campaignId.name,
      flowId: flow.id,
      stageId,
      stageName,
      campaigns
    });
  };

  const getStageCount = (flow, stageId) => {
    return flow.stages[stageId]?.campaigns?.length || 0;
  };

  const getTotalCampaigns = (campaignIds) => {
    return campaignIds.reduce((total, campaignIdGroup) => {
      return total + campaignIdGroup.flows.reduce((flowTotal, flow) => {
        return flowTotal + Object.values(flow.stages).reduce((stageSum, stage) => {
          return stageSum + (stage.campaigns?.length || 0);
        }, 0);
      }, 0);
    }, 0);
  };

  const getCampaignIdTotal = (flows) => {
    return flows.reduce((total, flow) => {
      return total + Object.values(flow.stages).reduce((sum, stage) => {
        return sum + (stage.campaigns?.length || 0);
      }, 0);
    }, 0);
  };

  const getFlowTotal = (flow) => {
    return Object.values(flow.stages).reduce((sum, stage) => {
      return sum + (stage.campaigns?.length || 0);
    }, 0);
  };

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error loading data</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const reports = data?.reports || [];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaign Architecture</h1>
          <p className="text-gray-600">Unified interactive report across all client types</p>
        </div>

        {/* Tree Structure */}
        <div className="space-y-4">
          {reports.map(report => {
            const isExpanded = expandedReports.includes(report.id);
            const reportCampaignIds = report.campaignIds || [];
            const totalCampaigns = getTotalCampaigns(reportCampaignIds);
            const IconComponent = iconMap[report.id] || Home;

            return (
              <div key={report.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
                {/* Report Level */}
                <div
                  onClick={() => toggleReport(report.id)}
                  className="text-white p-6 cursor-pointer transition-all flex items-center justify-between hover:opacity-90"
                  style={{ backgroundColor: report.color }}
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6" />
                    ) : (
                      <ChevronRight className="w-6 h-6" />
                    )}
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{report.name}</h2>
                      <p className="text-sm opacity-90">{report.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{totalCampaigns}</div>
                    <div className="text-sm opacity-90">total campaigns</div>
                  </div>
                </div>

                {/* Campaign ID Level (Lomond, Octopus, Strala, etc.) */}
                {isExpanded && (
                  <div className="p-6 space-y-3">
                    {reportCampaignIds.map(campaignIdGroup => {
                      const campaignIdKey = `${report.id}-${campaignIdGroup.id}`;
                      const isCampaignIdExpanded = expandedCampaignIds.includes(campaignIdKey);
                      const campaignIdTotal = getCampaignIdTotal(campaignIdGroup.flows);

                      return (
                        <div key={campaignIdKey} className="border-2 border-gray-300 rounded-lg overflow-hidden">
                          {/* Campaign ID Header (e.g., "Lomond") */}
                          <div
                            onClick={() => toggleCampaignId(campaignIdKey)}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 p-4 cursor-pointer transition-all flex items-center justify-between border-b-2 border-blue-200"
                          >
                            <div className="flex items-center gap-3">
                              {isCampaignIdExpanded ? (
                                <ChevronDown className="w-5 h-5 text-blue-700" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-blue-700" />
                              )}
                              <div className="bg-blue-600 bg-opacity-10 rounded-lg p-2">
                                <Folder className="w-5 h-5 text-blue-700" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-blue-900">{campaignIdGroup.name}</h3>
                                <p className="text-xs text-blue-600">{campaignIdGroup.flows.length} flow{campaignIdGroup.flows.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-blue-900">{campaignIdTotal}</span>
                              <span className="text-sm text-blue-600 ml-2">campaigns</span>
                            </div>
                          </div>

                          {/* Flows Level (e.g., "Lomond flow version 1") */}
                          {isCampaignIdExpanded && (
                            <div className="p-4 space-y-3 bg-gray-50">
                              {campaignIdGroup.flows.map(flow => {
                                const flowKey = `${campaignIdKey}-${flow.id}`;
                                const isFlowExpanded = expandedFlows.includes(flowKey);
                                const flowCampaignCount = getFlowTotal(flow);

                                return (
                                  <div key={flowKey} className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                                    {/* Flow Header */}
                                    <div
                                      onClick={() => toggleFlow(flowKey)}
                                      className="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer transition-all flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3">
                                        {isFlowExpanded ? (
                                          <ChevronDown className="w-5 h-5 text-gray-600" />
                                        ) : (
                                          <ChevronRight className="w-5 h-5 text-gray-600" />
                                        )}
                                        <div>
                                          <h4 className="text-base font-semibold text-gray-900">{flow.name}</h4>
                                          <p className="text-xs text-gray-500">{flow.objective}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">{flowCampaignCount} campaign{flowCampaignCount !== 1 ? 's' : ''}</span>
                                      </div>
                                    </div>

                                    {/* Pipeline Stages */}
                                    {isFlowExpanded && (
                                      <div className="p-4 bg-white">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                          {stages.map((stage, idx) => {
                                            const campaignCount = getStageCount(flow, stage.id);
                                            const peopleCount = flow.peopleCounts?.[stage.id] || 0;
                                            const hasNoCampaigns = campaignCount === 0;

                                            return (
                                              <React.Fragment key={stage.id}>
                                                <button
                                                  onClick={() => !hasNoCampaigns && openStagePanel(report, campaignIdGroup, flow, stage.id, stage.name)}
                                                  disabled={hasNoCampaigns}
                                                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all min-w-[140px] ${
                                                    hasNoCampaigns
                                                      ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                                                      : 'hover:shadow-md cursor-pointer'
                                                  }`}
                                                  style={!hasNoCampaigns ? {
                                                    backgroundColor: `${stage.color}15`,
                                                    borderColor: stage.color,
                                                  } : {}}
                                                >
                                                  <div className="text-center">
                                                    <div className="font-semibold text-sm mb-1" style={{ color: hasNoCampaigns ? '#9CA3AF' : stage.color }}>
                                                      {stage.name}
                                                    </div>
                                                    <div className={`text-2xl font-bold ${hasNoCampaigns ? 'text-gray-400' : ''}`}
                                                      style={!hasNoCampaigns ? { color: stage.color } : {}}>
                                                      {peopleCount.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs mt-1 opacity-70" style={{ color: hasNoCampaigns ? '#9CA3AF' : stage.color }}>
                                                      {campaignCount} campaign{campaignCount !== 1 ? 's' : ''}
                                                    </div>
                                                  </div>
                                                </button>
                                                {idx < stages.length - 1 && (
                                                  <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                )}
                                              </React.Fragment>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel for Stage Campaigns */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto">
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedStage.stageName} Stage
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedStage.campaignIdGroup} → {selectedStage.flowId}
                </p>
                <p className="text-sm text-gray-500">{selectedStage.campaigns.length} campaigns in this stage</p>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Campaign List */}
            <div className="p-6 space-y-3">
              {selectedStage.campaigns.map((campaign, idx) => {
                const channelColors = getChannelColor(campaign.channel);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCampaign(campaign)}
                    className="rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer border-2"
                    style={{
                      backgroundColor: `${channelColors.bg}10`,
                      borderColor: channelColors.border
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg p-3 text-white" style={{ backgroundColor: channelColors.bg }}>
                        {getChannelIcon(campaign.channel)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{campaign.timing}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="capitalize">{campaign.channel}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCampaign.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 text-white" style={{ backgroundColor: getChannelColor(selectedCampaign.channel).bg }}>
                    {getChannelIcon(selectedCampaign.channel)}
                  </div>
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {selectedCampaign.channel === 'ma' ? 'Marketing Automation' : selectedCampaign.channel}
                  </span>
                  {selectedCampaign.status && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedCampaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCampaign.status}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedCampaign.id && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5" style={{ color: '#2C537A' }} />
                    <h3 className="font-semibold text-gray-900">Campaign ID</h3>
                  </div>
                  <p className="text-gray-700 ml-7 font-mono text-sm">{selectedCampaign.id}</p>
                </div>
              )}

              {selectedCampaign.objective && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" style={{ color: '#2C537A' }} />
                    <h3 className="font-semibold text-gray-900">Objective</h3>
                  </div>
                  <p className="text-gray-700 ml-7">{selectedCampaign.objective}</p>
                </div>
              )}

              {selectedCampaign.copy && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5" style={{ color: '#2C537A' }} />
                    <h3 className="font-semibold text-gray-900">Copy</h3>
                  </div>
                  <p className="text-gray-700 ml-7 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {selectedCampaign.copy}
                  </p>
                </div>
              )}

              {selectedCampaign.cta && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="w-5 h-5" style={{ color: '#D9B9A0' }} />
                    <h3 className="font-semibold text-gray-900">Call to Action</h3>
                  </div>
                  <div className="ml-7">
                    <span className="inline-block px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: '#2C537A' }}>
                      {selectedCampaign.cta}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
              <button className="flex-1 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all"
                style={{ backgroundColor: '#2C537A' }}>
                Edit Campaign
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignArchitecture;
