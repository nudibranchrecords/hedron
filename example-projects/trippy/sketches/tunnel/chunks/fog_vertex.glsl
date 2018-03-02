vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

#ifdef USE_FOG
fogDepth = -mvPosition.z;
#endif
