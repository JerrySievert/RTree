var Terraformer = require('terraformer');

function envelope (geojson) {
	return Terraformer.Tools.calculateEnvelope(geojson);
}

function envelopeWithinEnvelope (e1, e2) {
  if (e1.x < e2.x || e1.y < e2.y || (e2.x + e2.w) < (e1.x + e1.w) || (e2.y + e2.h) < (e1.y + e1.h)) {
    return false;
  }

  return true;
}

function envelopeFromEnvelopes (envelopes) {
  var envelope = { };

  for (var i = 0; i < envelopes.length; i++) {
    if (envelope.x === undefined) {
      envelope = envelopes[i];
    } else {
      var x = Math.min(envelope.x, envelopes[i].x),
          y = Math.min(envelope.y, envelopes[i].y);

      envelope.w = Math.max(envelope.x + envelope.w, envelopes[i].y + envelopes[i].w) - x;
      envelope.h = Math.max(envelope.y + envelope.h, envelopes[i].y + envelopes[i].h) - y;

      envelope.x = x;
      envelope.y = y;
    }
  }

  return envelope;
}

exports.envelope = envelope;
exports.envelopeWithinEnvelope = envelopeWithinEnvelope;
exports.envelopeFromEnvelopes = envelopeFromEnvelopes;