import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:podcast_search/podcast_search.dart';
import 'package:url_launcher/url_launcher.dart';

class EpisodeDetails extends StatelessWidget {
  final Episode episode;

  const EpisodeDetails({Key key, @required this.episode}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: false,
        title: Text('Episode Details'),
      ),
      body: Scrollbar(
        child: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              ListTile(
                leading: Icon(Icons.title),
                title: Text('Title'),
                subtitle: Text('${episode.title}'),
              ),
              ListTile(
                leading: Icon(Icons.person_outline),
                title: Text('Author'),
                subtitle: Text('${episode.author}'),
              ),
              Markdown(
                data: episode.description,
                shrinkWrap: true,
                onTapLink: (text, href, title) => launch(href),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
