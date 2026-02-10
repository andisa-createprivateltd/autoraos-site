import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../application/app_controller.dart';
import '../../application/view_models/analytics_view_model.dart';
import '../../domain/models/analytics_snapshot.dart';
import '../../domain/repositories/dealer_os_repository.dart';
import '../widgets/error_banner.dart';
import '../widgets/loading_state_view.dart';
import '../widgets/metric_tile.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key, required this.repository});

  final DealerOsRepository repository;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<AnalyticsViewModel>(
      create: (_) => AnalyticsViewModel(repository: repository),
      child: const _AnalyticsBody(),
    );
  }
}

class _AnalyticsBody extends StatefulWidget {
  const _AnalyticsBody();

  @override
  State<_AnalyticsBody> createState() => _AnalyticsBodyState();
}

class _AnalyticsBodyState extends State<_AnalyticsBody> {
  bool _didLoad = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didLoad) {
      return;
    }

    _didLoad = true;
    final session = context.read<AppController>().session;
    if (session != null) {
      Future<void>.microtask(() {
        context.read<AnalyticsViewModel>().load(session: session);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final session = context.watch<AppController>().session;
    final viewModel = context.watch<AnalyticsViewModel>();

    if (session == null) {
      return const LoadingStateView();
    }

    final List<ResponseTrendPoint> trend = viewModel.selectedRangeDays == 7
        ? viewModel.snapshot.responseTrend7d
        : viewModel.snapshot.responseTrend30d;

    return Stack(
      children: <Widget>[
        RefreshIndicator(
          onRefresh: () => viewModel.load(session: session),
          child: ListView(
            padding: const EdgeInsets.all(12),
            children: <Widget>[
              SegmentedButton<int>(
                segments: const <ButtonSegment<int>>[
                  ButtonSegment<int>(value: 7, label: Text('7 days')),
                  ButtonSegment<int>(value: 30, label: Text('30 days')),
                ],
                selected: <int>{viewModel.selectedRangeDays},
                onSelectionChanged: (Set<int> selection) {
                  viewModel.selectedRangeDays = selection.first;
                },
              ),
              const SizedBox(height: 14),
              Text('Response Time Trend', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 10),
              SizedBox(
                height: 220,
                child: LineChart(
                  LineChartData(
                    borderData: FlBorderData(show: false),
                    gridData: const FlGridData(show: true),
                    lineBarsData: <LineChartBarData>[
                      LineChartBarData(
                        isCurved: true,
                        spots: trend
                            .asMap()
                            .entries
                            .map(
                              (entry) => FlSpot(
                                entry.key.toDouble(),
                                entry.value.avgSeconds,
                              ),
                            )
                            .toList(),
                        color: Colors.blue,
                        barWidth: 3,
                        dotData: const FlDotData(show: false),
                      ),
                    ],
                    titlesData: FlTitlesData(
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (double value, TitleMeta meta) {
                            final int index = value.toInt();
                            if (index < 0 || index >= trend.length) {
                              return const SizedBox();
                            }
                            return Text(DateFormat('MMMd').format(trend[index].date.toLocal()));
                          },
                          reservedSize: 32,
                        ),
                      ),
                      leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true)),
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text('Leads by Source', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 10),
              SizedBox(
                height: 220,
                child: BarChart(
                  BarChartData(
                    borderData: FlBorderData(show: false),
                    gridData: const FlGridData(show: true),
                    barGroups: viewModel.snapshot.sourceBreakdown
                        .asMap()
                        .entries
                        .map(
                          (entry) => BarChartGroupData(
                            x: entry.key,
                            barRods: <BarChartRodData>[
                              BarChartRodData(
                                toY: entry.value.count.toDouble(),
                                color: Colors.orange,
                                width: 16,
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ],
                          ),
                        )
                        .toList(),
                    titlesData: FlTitlesData(
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (double value, TitleMeta meta) {
                            final int index = value.toInt();
                            if (index < 0 || index >= viewModel.snapshot.sourceBreakdown.length) {
                              return const SizedBox();
                            }
                            return Text(viewModel.snapshot.sourceBreakdown[index].source.value);
                          },
                          reservedSize: 30,
                        ),
                      ),
                      leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true)),
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: <Widget>[
                  MetricTile(
                    title: 'Bookings',
                    value: '${viewModel.snapshot.bookingsCount}',
                    color: Colors.green,
                  ),
                  const SizedBox(width: 10),
                  MetricTile(
                    title: 'After-hours handled',
                    value: '${viewModel.snapshot.afterHoursHandledPercent.toStringAsFixed(0)}%',
                    color: Colors.purple,
                  ),
                ],
              ),
            ],
          ),
        ),
        if (viewModel.errorMessage != null)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ErrorBanner(message: viewModel.errorMessage!),
          ),
      ],
    );
  }
}
