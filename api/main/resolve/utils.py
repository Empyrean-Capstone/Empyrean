"""TODO."""
from astropy.table import Table
from astropy.coordinates import EarthLocation, SkyCoord, AltAz
from astropy.time import Time
from astroquery.simbad import Simbad
import astropy.units as units

Simbad.ROW_LIMIT = 1


def get_airmass(sky_coord):
    """
    TODO.

    Args:
        sky_coord ():

    Returns:

    """
    cur_time = Time.now()
    location = EarthLocation.of_site("lowell")

    alt_az_coord = AltAz(obstime=cur_time, location=location)

    obj_altaz = sky_coord.transform_to(alt_az_coord)

    return obj_altaz.alt.value


def query_for_target(target) -> tuple | dict:
    """
    TODO.

    Args:
        target ():

    Returns:

    """
    # https://astroquery.readthedocs.io/en/latest/api/astroquery.simbad.SimbadClass.html#astroquery.simbad.SimbadClass
    query: Table = Simbad.query_object(target, wildcard=True)

    if query is None:
        # https://flask.palletsprojects.com/en/2.2.x/quickstart/#about-responses
        return ({}, 502)

    sky_coord = SkyCoord(
        query[0]["RA"], query[0]["DEC"], unit=(units.hourangle, units.deg)
    )

    right_asc = sky_coord.ra.to_string(
        unit=units.hourangle, sep=":", pad=True, precision=2
    )

    dec = sky_coord.dec.to_string(
        unit=units.deg, sep=":", pad=True, precision=2, alwayssign=True
    )

    obj_alt = get_airmass(sky_coord)

    if obj_alt > 15:
        obj_vis_bool = "True"
    else:
        obj_vis_bool = "False"

    return {
        "right_ascension": right_asc,
        "declination": dec,
        "altitude": f"{obj_alt:.2f}",
        "visible": f"{obj_vis_bool:s}",
    }
