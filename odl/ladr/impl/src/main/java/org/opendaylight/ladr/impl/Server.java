/*
 * Copyright © 2016 Ladr, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.ladr.impl;

import java.math.BigDecimal;

class Server {
    private String _id;
    private String _rev;
    private double latitude;
    private double longitude;
    private double distance;
    private String ipAddress;
    private String locationId;

    public Server(double _latitude, double _longitude, String _ipAddress, String _locationId) {

        latitude = _latitude;
        longitude = _longitude;
        ipAddress = _ipAddress;
        locationId = _locationId;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String get_rev() {
        return _rev;
    }

    public void set_rev(String _rev) {
        this._rev = _rev;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public BigDecimal getLatitudeBD() {
        return new BigDecimal(latitude);
    }

    public BigDecimal getLongitudeBD() {
        return new BigDecimal(longitude);
    }

    public BigDecimal getDistanceBD() {
        return new BigDecimal(distance);
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getDistance() {
        return distance;
    }

    public String getLocationId() {
        return locationId;
    }

    @Override
    public String toString() {
        return "{ id: " + _id + ",\nrev: " + _rev + ",\nlatitude: " + latitude + ",\nlongitude: " + longitude
                + ",\nipAddress: " + ipAddress + ",\nlocationId: " + locationId + "\n}";
    }
}